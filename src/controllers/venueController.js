import { venueService } from "../services/venueService.js";

/**
 * Venue Controller
 */
export const venueController = {
  // POST /api/v1/venues
  registerVenue: async (req, res) => {
    try {
      // Logic: Take venue details from body, ownerId from the JWT user object
      const venue = await venueService.createVenue(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: "Venue registered successfully",
        data: venue
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/venues/my-venues
  getMyVenues: async (req, res) => {
    try {
      const venues = await venueService.getPartnerVenues(req.user._id);
      res.status(200).json({ success: true, data: venues });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/venues
  listVenues: async (req, res) => {
    try {
      const { city } = req.query;
      const venues = await venueService.getVenuesByCity(city);
      res.status(200).json({ success: true, data: venues });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/venues/all
  listAllVenues: async (req, res) => {
    try {
      const venues = await venueService.getAllVenues();
      res.status(200).json({ success: true, data: venues });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/venues/:city/

  getSpecificVenueByCity: async (req, res) => {
    try {
      const { city } = req.params; // Extract city and venueId from params
      const venue = await venueService.getVenuesByCity(city);
      if (!venue) {
        return res.status(404).json({ success: false, message: "Venue not found in the specified city" });
      }
      res.status(200).json({ success: true, data: venue });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};