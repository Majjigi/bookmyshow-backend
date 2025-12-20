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
    // 1. Validate Movie existence
    const movie = await Movie.findById(showData.movie);
    if (!movie) throw new Error("The selected movie does not exist in the catalog.");

    // 2. Validate Venue existence and Ownership
    const venue = await Venue.findById(showData.venue);
    if (!venue) throw new Error("Venue not found.");
    
    if (venue.ownerId.toString() !== partnerId.toString()) {
      throw new Error("Unauthorized: You can only schedule shows for venues you own.");
    }

    // 3. Automatically calculate end time (Start + Duration + 15 min interval)
    const start = new Date(showData.startTime);
    const durationInMs = (movie.durationInMinutes + 15) * 60 * 1000; 
    const end = new Date(start.getTime() + durationInMs);

    // 4. Create the show
    const show = await Show.create({
      ...showData,
      endTime: end,
      totalSeats: showData.totalSeats || 100, // Default or from venue capacity
      availableSeats: showData.totalSeats || 100
    });

    return show;
  },

  // Get all shows for a specific venue (Partner view)
  getVenueSchedule: async (venueId) => {
    return await Show.find({ venue: venueId })
      .populate("movie", "title durationInMinutes language")
      .sort({ startTime: 1 });
  },

  // Get shows for a movie in a specific city (Customer view)
  getMovieShowsByCity: async (movieId, city) => {
    // This requires a join/populate with Venue to filter by city
    const shows = await Show.find({ movie: movieId })
      .populate({
        path: "venue",
        match: { "address.city": city, isActive: true },
        select: "name address location"
      });
    
    // Filter out shows where the venue didn't match the city criteria
    return shows.filter(show => show.venue !== null);
  }
};