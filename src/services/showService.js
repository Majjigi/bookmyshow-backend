import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { Show } from "../models/showModel.js";
import { Movie } from "../models/movieModel.js";
import { Venue } from "../models/venueModel.js";

/**
 * Show Service
 * Handles the logic of connecting Movies to Venues at specific times.
 */
export const showService = {
  // Create a new show instance
  createShow: async (showData, partnerId) => {
    // Validate partner id
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      throw new ApiError(400, "Invalid partner id");
    }

    // Validate movie id
    if (!mongoose.Types.ObjectId.isValid(showData.movie)) {
      throw new ApiError(400, "Invalid movie id");
    }

    // Validate venue id
    if (!mongoose.Types.ObjectId.isValid(showData.venue)) {
      throw new ApiError(400, "Invalid venue id");
    }

    // Validate Movie existence
    const movie = await Movie.findById(showData.movie);
    if (!movie) throw new ApiError(404, "The selected movie does not exist in the catalog.");

    // Validate Venue existence and Ownership
    const venue = await Venue.findById(showData.venue);
    if (!venue) throw new ApiError(404, "Venue not found.");

    if (venue.ownerId.toString() !== partnerId.toString()) {
      throw new ApiError(403, "Unauthorized: You can only schedule shows for venues you own.");
    }

    // Validate and parse start time
    const start = new Date(showData.startTime);
    if (Number.isNaN(start.getTime())) {
      throw new ApiError(400, "Invalid startTime");
    }

    // 3. Automatically calculate end time (Start + Duration + 15 min interval)
    const durationInMs = (movie.durationInMinutes + 15) * 60 * 1000;
    const end = new Date(start.getTime() + durationInMs);

    // Check for overlapping shows in the same venue
    const overlapping = await Show.findOne({
      venue: venue._id,
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    });

    if (overlapping) {
      throw new ApiError(409, "Show overlap detected for the selected venue/time");
    }

    // Determine total seats: explicit or from venue seatCategories sum
    let totalSeats = 100;
    if (typeof showData.totalSeats === "number" && showData.totalSeats > 0) {
      totalSeats = showData.totalSeats;
    } else if (venue.seatCategories && venue.seatCategories.length) {
      totalSeats = venue.seatCategories.reduce((sum, s) => sum + (s.capacity || 0), 0) || 100;
    }

    // 4. Create the show
    const show = await Show.create({
      ...showData,
      startTime: start,
      endTime: end,
      totalSeats,
      availableSeats: totalSeats,
    });

    return show;
  },

  // Get all shows for a specific venue (Partner view)
  getVenueSchedule: async (venueId) => {
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      throw new ApiError(400, "Invalid venue id");
    }

    return await Show.find({ venue: venueId })
      .populate("movie", "title durationInMinutes language")
      .sort({ startTime: 1 });
  },

  // Get shows for a movie in a specific city (Customer view)
  getMovieShowsByCity: async (movieId, city) => {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const movie = await Movie.findById(movieId);
    if (!movie) throw new ApiError(404, "Movie not found");

    // This requires a join/populate with Venue to filter by city
    const shows = await Show.find({ movie: movieId })
      .populate({
        path: "venue",
        match: city ? { "address.city": city, isActive: true } : { isActive: true },
        select: "name address location",
      });

    // Filter out shows where the venue didn't match the city criteria
    return shows.filter((show) => show.venue !== null);
  },
};