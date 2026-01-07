import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { venueService } from "../services/venueService.js";

/**
 * Venue Controller
 */
export const venueController = {
  // POST /api/v1/venues
  registerVenue: asyncHandler(async (req, res) => {
    // Logic: Take venue details from body, ownerId from the JWT user object
    const venue = await venueService.createVenue(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: "Venue registered successfully",
      data: venue,
    });
  }),

  // GET /api/v1/venues/my-venues
  getMyVenues: asyncHandler(async (req, res) => {
    const venues = await venueService.getPartnerVenues(req.user._id);
    res.status(200).json({ success: true, data: venues });
  }),

  // GET /api/v1/venues
  listVenues: asyncHandler(async (req, res) => {
    const { city } = req.query;
    const venues = await venueService.getVenuesByCity(city);
    res.status(200).json({ success: true, data: venues });
  }),

  // GET /api/v1/venues/all
  listAllVenues: asyncHandler(async (req, res) => {
    const venues = await venueService.getAllVenues();
    res.status(200).json({ success: true, data: venues });
  }),

  // GET /api/v1/venues/:city/
  getSpecificVenueByCity: asyncHandler(async (req, res) => {
    const { city } = req.params; // Extract city from params
    const venues = await venueService.getVenuesByCity(city);
    if (!venues || venues.length === 0) {
      throw new ApiError(404, "No venue found in the specified city");
    }
    res.status(200).json({ success: true, data: venues });
  }),
};