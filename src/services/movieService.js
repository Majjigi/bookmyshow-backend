import mongoose from "mongoose";
import { Movie } from "../models/movieModel.js";
import ApiError from "../utils/ApiError.js";

/**
 * Movie Service
 * Handles all database interactions and business logic for Movies.
 */
export const movieService = {
  // Create a new movie entry
  createMovie: async (movieData) => {
    try {
      const movie = await Movie.create(movieData);
      return movie;
    } catch (err) {
      // Convert Mongoose validation errors to ApiError with 400
      throw new ApiError(400, err.message || "Failed to create movie");
    }
  },

  // Get all movies with filtering and pagination
  getAllMovies: async ({ genre, language, search, page = 1, limit = 10 }) => {
    const query = {};

    // Normalize language filter: accept array, comma-separated string or single value
    if (language) {
      if (Array.isArray(language)) {
        query.language = { $in: language };
      } else if (typeof language === "string" && language.includes(",")) {
        query.language = { $in: language.split(",").map((l) => l.trim()) };
      } else {
        query.language = language;
      }
    }

    // Filter by Genre
    // Accept array, comma-separated string ("Action,Drama"), or single genre string
    if (genre) {
      if (Array.isArray(genre)) {
        query.genre = { $in: genre };
      } else if (typeof genre === "string" && genre.includes(",")) {
        query.genre = { $in: genre.split(",").map((g) => g.trim()) };
      } else {
        query.genre = genre;
      }
    }

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Sanitize & normalize pagination parameters
    const pageNum = Number.isNaN(Number(page)) ? 1 : Math.max(1, parseInt(page, 10));
    const limitNum = Number.isNaN(Number(limit)) ? 10 : Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const movies = await Movie.find(query)
      .sort({ releaseDate: -1 }) // Newest first
      .skip(skip)
      .limit(limitNum);

    const totalMovies = await Movie.countDocuments(query);

    return {
      movies,
      pagination: {
        totalMovies,
        currentPage: pageNum,
        totalPages: Math.ceil(totalMovies / limitNum),
      },
    };
  },

  // Get a specific movie by ID
  getMovieById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const movie = await Movie.findById(id);
    if (!movie) throw new ApiError(404, "Movie not found");
    return movie;
  },

  // Update movie details
  updateMovie: async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const movie = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) throw new ApiError(404, "Movie not found");
    return movie;
  },

  // Delete a movie
  deleteMovie: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new ApiError(404, "Movie not found");
    return movie;
  },
};
