import mongoose, { Schema } from "mongoose";

/**
 * Movie Schema
 * Stores global metadata about films available on the platform
 */
const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
    },
    language: [
      {
        type: String, // e.g., ["English", "Hindi", "Telugu"]
        required: true,
      },
    ],
    genre: [
      {
        type: String, // e.g., ["Action", "Sci-Fi", "Drama"]
      },
    ],
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String, // Main thumbnail
    },
    trailerUrl: {
      type: String, // YouTube/Vimeo link
    },
    cast: [
      {
        name: String,
        roleName: String,
        photoUrl: String,
      },
    ],
    director: {
      type: String,
    },
    rating: {
      type: String, // e.g., "UA", "A", "U"
      required: true,
    },
    isReleased: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
