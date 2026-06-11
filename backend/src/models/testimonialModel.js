import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    quote: {
      type: String,
      required: [true, "Feedback message cannot be left blank."],
      trim: true
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    }
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
