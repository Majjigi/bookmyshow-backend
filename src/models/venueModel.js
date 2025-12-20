import mongoose, { Schema } from "mongoose";
/**
 * Venue Schema
 * Represents a physical location where events/movies take place (e.g., Cinema, Stadium, Theater)
 */
const venueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: {
        type: String,
        required: true,
        index: true,
      },
      state: String,
      zipCode: String,
      country: String,
    },
    // GeoJSON for proximity-based searches (e.g., "Cinemas near me")
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    images: [
      {
        type: String, // URLs to gallery images
      },
    ],
    amenities: [
      {
        type: String, // e.g., ["Parking", "Food Court", "Wheelchair Access"]
      },
    ],
    // Defines the standard seat categories available at this venue
    seatCategories: [
      {
        name: { type: String, required: true }, // e.g., "Platinum", "Gold", "Silver"
        capacity: { type: Number, required: true },
        basePrice: { type: Number, required: true },
      },
    ],
    contactNumber: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Reference to the Partner/Manager who owns this venue
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
venueSchema.index({ location: "2dsphere" });

export const Venue = mongoose.model("Venue", venueSchema);
