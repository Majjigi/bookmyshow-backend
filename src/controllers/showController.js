import asyncHandler from "../utils/asyncHandler.js";
import { showService } from "../services/showService.js";

/**
 * Show Controller
 */
export const showController = {
  // POST /api/v1/shows
  addShow: asyncHandler(async (req, res) => {
    const partnerId = req.user._id;
    const show = await showService.createShow(req.body, partnerId);

    res.status(201).json({
      success: true,
      message: "Show scheduled successfully",
      data: show,
    });
  }),

  // GET /api/v1/shows/venue/:venueId
  getVenueSchedule: asyncHandler(async (req, res) => {
    const shows = await showService.getVenueSchedule(req.params.venueId);
    res.status(200).json({ success: true, data: shows });
  }),

  // GET /api/v1/shows/movie/:movieId
  getMovieShows: asyncHandler(async (req, res) => {
    const { city } = req.query;
    const shows = await showService.getMovieShowsByCity(req.params.movieId, city);
    res.status(200).json({ success: true, data: shows });
  }),
};