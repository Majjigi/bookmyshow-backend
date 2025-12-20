import mongoose from "mongoose";
import { Booking } from "../models/bookingModel.js";
import { Show } from "../models/showModel.js";

/**
 * Service to handle seat locking logic
 */
export const lockSeatsForBooking = async (
  userId,
  showId,
  seatIds,
  totalAmount
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if the show exists
    const show = await Show.findById(showId).session(session);
    if (!show) {
      throw new Error("Show not found");
    }

    // 2. Check for concurrency: Are any of these seats already 'Confirmed' or 'Pending' (locked)?
    const existingBookings = await Booking.find({
      show: showId,
      status: { $in: ["Confirmed", "Pending"] },
      seats: { $in: seatIds },
    }).session(session);

    if (existingBookings.length > 0) {
      throw new Error(
        "One or more seats are already selected or booked by someone else."
      );
    }

    // 3. Create a 'Pending' booking (The Lock)
    // We set 'expiresAt' to 10 minutes from now.
    const lockDuration = 10 * 60 * 1000; // 10 minutes
    const expiresAt = new Date(Date.now() + lockDuration);

    const newBooking = await Booking.create(
      [
        {
          user: userId,
          show: showId,
          seats: seatIds,
          totalAmount,
          status: "Pending",
          expiresAt: expiresAt,
        },
      ],
      { session }
    );

    // 4. Update Show availability (optional optimization)
    show.availableSeats -= seatIds.length;
    await show.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      bookingId: newBooking[0]._id,
      message: "Seats locked for 10 minutes. Please complete payment.",
    };
  } catch (error) {
    // If anything fails, abort the transaction to release any partial changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Finalize Booking after Payment
 */
export const confirmBooking = async (bookingId, transactionId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status === "Expired") {
    throw new Error("Booking has expired or does not exist.");
  }

  booking.status = "Confirmed";
  booking.expiresAt = undefined; // Remove the expiration timer
  await booking.save();

  return booking;
};
