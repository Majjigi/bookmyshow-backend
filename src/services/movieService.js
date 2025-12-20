import { Movie } from "../models/movieModel.js";

/**
 * Movie Service
 * Handles all database interactions and business logic for Movies.
 */
export const movieService = {
  // Create a new movie entry
  createMovie: async (movieData) => {
    return await Movie.create(movieData);
  },

  // Get all movies with filtering and pagination
  getAllMovies: async ({ genre, language, search, page = 1, limit = 10 }) => {
    const query = {};

    if (genre) query.genre = genre;
    if (language) query.language = language;
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
      .sort({ releaseDate: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit));

    const totalMovies = await Movie.countDocuments(query);

    return {
      movies,
      pagination: {
        totalMovies,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMovies / limit),
      },
    };
  },

  // Get a specific movie by ID
  getMovieById: async (id) => {
    const movie = await Movie.findById(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  },

  // Update movie details
  updateMovie: async (id, updateData) => {
    const movie = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!movie) throw new Error("Movie not found");
    return movie;
  },

  // Delete a movie
  deleteMovie: async (id) => {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  },
};
