import { Venue } from "../models/venueModel.js";
import { User } from "../models/userModel.js";
/**
 * Venue Service
 */
export const venueService = {
  createVenue: async (venueData, ownerId) => {
    // 1. Create the venue
    const venue = await Venue.create({
      ...venueData,
      ownerId: ownerId,
    });

    // 2. Link the venue back to the Partner's profile
    await User.findByIdAndUpdate(ownerId, {
      venueId: venue._id
    });

    return venue;
  },

  // Get venues owned by a specific partner
  getPartnerVenues: async (ownerId) => {
    return await Venue.find({ ownerId });
  },

  // Get all venues in a city (for customers)
  getVenuesByCity: async (city) => {
    const query = { "address.city": city, isActive: true };
    // if (venueId) {
    //   query._id = venueId;
    // }
    return await Venue.find(query);
  },

  // Get all venues
  getAllVenues: async () => {
    return await Venue.find();
  },

  // Update venue details (e.g., adding seats or changing amenities)
  updateVenue: async (venueId, ownerId, updateData) => {
    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, ownerId }, // Ensure only the owner can update
      updateData,
      { new: true, runValidators: true }
    );
    if (!venue) throw new Error("Venue not found or unauthorized");
    return venue;
  }
};


// export default venueService;