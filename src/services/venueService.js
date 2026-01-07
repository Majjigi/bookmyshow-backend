import mongoose from "mongoose";
import { Venue } from "../models/venueModel.js";
import { User } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";

/**
 * Venue Service
 */
export const venueService = {
  createVenue: async (venueData, ownerId) => {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      throw new ApiError(400, "Invalid owner id");
    }

    const owner = await User.findById(ownerId);
    if (!owner) throw new ApiError(404, "Owner not found");

    try {
      const venue = await Venue.create({ ...venueData, ownerId });

      // Link the venue back to the Partner's profile (best-effort)
      await User.findByIdAndUpdate(ownerId, { venueId: venue._id });

      return venue;
    } catch (err) {
      throw new ApiError(400, err.message || "Failed to create venue");
    }
  },

  // Get venues owned by a specific partner
  getPartnerVenues: async (ownerId) => {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      throw new ApiError(400, "Invalid owner id");
    }
    return await Venue.find({ ownerId });
  },

  // Get all venues in a city (for customers)
  getVenuesByCity: async (city) => {
    const query = { isActive: true };
    if (city) query["address.city"] = city;
    return await Venue.find(query);
  },

  // Get all venues
  getAllVenues: async () => {
    return await Venue.find();
  },

  // Update venue details (e.g., adding seats or changing amenities)
  updateVenue: async (venueId, ownerId, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(venueId) || !mongoose.Types.ObjectId.isValid(ownerId)) {
      throw new ApiError(400, "Invalid id(s)");
    }

    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, ownerId }, // Ensure only the owner can update
      updateData,
      { new: true, runValidators: true }
    );
    if (!venue) throw new ApiError(404, "Venue not found or unauthorized");
    return venue;
  },
};


// export default venueService;