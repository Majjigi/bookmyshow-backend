import mongoose, { Schema } from "mongoose";

/**
 * Show Schema
 * Represents a specific screening instance of a movie at a venue
 */
const showSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    screenNumber: {
      type: String,
      required: true,
    },
    // Allows overriding base prices from the Venue for specific blockbusters or morning shows
    pricing: [
      {
        categoryName: String, // matches Venue.seatCategories.name
        price: Number,
      },
    ],
    // Tracks the current state of the seating layout for this specific show
    // In a production app, this might be a separate collection or a Redis cache
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    // Simplified status
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

// Indexing for performance when users search for shows on a specific date
showSchema.index({ venue: 1, startTime: 1 });
showSchema.index({ movie: 1, startTime: 1 });

export const Show = mongoose.model("Show", showSchema);
