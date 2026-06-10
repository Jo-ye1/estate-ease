import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email path parameter is strictly required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a fully valid email syntax pattern"
      ]
    },
  },
  { timestamps: true } // Keeps record logs of when users joined your leads list
);

export default mongoose.model("Newsletter", newsletterSchema);
