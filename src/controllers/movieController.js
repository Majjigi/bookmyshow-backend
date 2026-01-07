import asyncHandler from "../utils/asyncHandler.js";
import { movieService } from "../services/movieService.js";

/**
 * Movie Controller
 * Interprets HTTP requests and sends responses.
 */

const createMovie = asyncHandler(async (req, res) => {
  console.log(" Creating movie with data:", req.body);
  const movie = await movieService.createMovie(req.body);
  console.log(movie);
  res.status(201).json({
    success: true,
    message: "Movie added successfully",
    data: movie,
  });
});

const listMovies = asyncHandler(async (req, res) => {
  // Support filters sent in POST body (since route is POST) or query string
  const filters = Object.keys(req.body || {}).length ? req.body : req.query;
  const result = await movieService.getAllMovies(filters);
  res.status(200).json({
    success: true,
    data: result.movies,
    pagination: result.pagination,
  });
});

const getMovieDetails = asyncHandler(async (req, res) => {
  const movie = await movieService.getMovieById(req.params.id);
  res.status(200).json({ success: true, data: movie });
});

const updateMovie = asyncHandler(async (req, res) => {
  const updatedMovie = await movieService.updateMovie(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: updatedMovie,
  });
});

const removeMovie = asyncHandler(async (req, res) => {
  await movieService.deleteMovie(req.params.id);
  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
});

export default {
  createMovie,
  listMovies,
  getMovieDetails,
  updateMovie,
  removeMovie,
};
