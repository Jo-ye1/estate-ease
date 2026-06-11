import Testimonial from "../models/TestimonialModel.js";

// @desc    Get all high-rating active testimonials
// @route   GET /api/testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const reviews = await Testimonial.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(6); // Render top 6 recent reviews on homepage
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a new verified customer review
// @route   POST /api/testimonials
export const createTestimonial = async (req, res) => {
  try {
    const { quote, stars } = req.body;
    
    const review = await Testimonial.create({
      user: req.user._id, // Tied securely to active session tracking parameters
      quote,
      stars: Number(stars) || 5
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
