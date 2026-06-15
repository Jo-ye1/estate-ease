import mongoose from "mongoose";

export const isValidObjectId = (id) =>
  
    mongoose.Types.ObjectId.isValid(id);if (!isValidObjectId(req.params.id)) {
  return res.status(400).json({
    message: "Invalid ID",
  });
}