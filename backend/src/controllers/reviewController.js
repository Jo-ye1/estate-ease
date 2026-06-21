import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";

export const submitUserReviewScore = async (req, res) => {
  try {
    const { targetUserId, propertyId, rating, reviewText } = req.body;
    const ReviewModel = mongoose.model("Review");
    const UserModel = mongoose.model("User");

    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target profile not found." });
    }

    const review = await ReviewModel.create({
      reviewerId: req.user._id,
      targetUserId,
      propertyId,
      rating: Number(rating),
      reviewText
    });

    const targetReviews = await ReviewModel.find({ targetUserId });
    const totalCount = targetReviews.length;
    const totalScoreSum = targetReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageCalculatedRating = parseFloat((totalScoreSum / totalCount).toFixed(1));

    // Dynamic aggregation tracking injection updates variables live inside your user documents
    await UserModel.findByIdAndUpdate(targetUserId, {
      $set: {
        reviewScore: averageCalculatedRating,
        reviewCount: totalCount,
        averageRating: averageCalculatedRating
      }
    });

    await createNotification({
      recipient: targetUserId,
      type: "LEAD_STATUS_UPDATED",
      title: "New Client Feedback Received",
      message: `A verified buyer left you a ${rating}-star review. Your average platform reputation rating score is now ${averageCalculatedRating}.`,
      relatedId: review._id,
      relatedType: "Review"
    });

    res.status(201).json({
      success: true,
      message: "Review submitted and account ranking aggregates recalculated cleanly.",
      review,
      updatedAggregates: {
        totalReviewsCount: totalCount,
        runningAverageRating: averageCalculatedRating
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
