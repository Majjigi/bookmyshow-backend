import { showService } from "../services/showService.js";

/**
 * Show Controller
 */
export const showController = {
  // POST /api/v1/shows
  addShow: async (req, res) => {
    try {
      const partnerId = req.user._id;
      const show = await showService.createShow(req.body, partnerId);
      
      res.status(201).json({
        success: true,
        message: "Show scheduled successfully",
        data: show
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/shows/venue/:venueId
  getVenueSchedule: async (req, res) => {
    try {
      const shows = await showService.getVenueSchedule(req.params.venueId);
      res.status(200).json({ success: true, data: shows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/shows/movie/:movieId
  getMovieShows: async (req, res) => {
    try {
      const { city } = req.query;
      const shows = await showService.getMovieShowsByCity(req.params.movieId, city);
      res.status(200).json({ success: true, data: shows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};