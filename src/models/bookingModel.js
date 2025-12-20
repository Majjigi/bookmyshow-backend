import mongoose, { Schema } from "mongoose";

/**
 * Booking Schema
 * Handles the reservation of seats for a specific show by a user
 */
const bookingSchema = new Schema(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Array of seat identifiers (e.g., ["A1", "A2"])
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Expired"],
      default: "Pending",
    },
    // Reference to the payment details
    paymentDetails: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    bookingTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
