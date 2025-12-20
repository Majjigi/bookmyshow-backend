import { movieService } from "../services/movieService.js";

/**
 * Movie Controller
 * Interprets HTTP requests and sends responses.
 */
const movieController = {
  // POST /api/v1/movies
  createMovie: async (req, res) => {
    console.log(" Creating movie with data:", req.body);
    try {
      const movie = await movieService.createMovie(req.body);
      console.log(movie);
      res.status(201).json({
        success: true,
        message: "Movie added successfully",
        data: movie,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/movies
  listMovies: async (req, res) => {
    try {
      const result = await movieService.getAllMovies(req.query);
      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/v1/movies/:id
  getMovieDetails: async (req, res) => {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      res.status(200).json({ success: true, data: movie });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // PATCH /api/v1/movies/:id
  updateMovie: async (req, res) => {
    try {
      const updatedMovie = await movieService.updateMovie(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: updatedMovie,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/v1/movies/:id
  removeMovie: async (req, res) => {
    try {
      await movieService.deleteMovie(req.params.id);
      res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
};

export default movieController;
