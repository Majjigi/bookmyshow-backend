import mongoose, { Schema } from "mongoose";
/**
 * Payment Schema
 * Tracks the transaction status from third-party gateways (Stripe/Razorpay)
 */
const paymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    transactionId: {
      type: String, // ID from the payment gateway
      unique: true,
      sparse: true,
    },
    paymentMethod: {
      type: String, // e.g., "UPI", "Credit Card", "Wallet"
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
