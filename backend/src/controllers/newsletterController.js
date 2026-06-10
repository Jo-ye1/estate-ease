import Newsletter from "../models/NewsletterModel.js";

// @desc    Subscribe a user to the newsletter marketing lead database
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address." });
    }

    // Check if the user email has already been added to your database records
    const exists = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (exists) {
      return res.status(400).json({
        message: "This email address is already subscribed to our newsletter updates.",
      });
    }

    // Write lead collection entry directly into MongoDB
    await Newsletter.create({ email: email.toLowerCase().trim() });

    res.json({
      message: "Subscription successful! Thank you for joining Estate Ease.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An unhandled newsletter validation crash occurred.",
    });
  }
};
