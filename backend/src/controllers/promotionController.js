import Promotion from "../models/Promotion.js";

export const createPromotion =
  async (req, res) => {
    try {
      const promotion =
        await Promotion.create(
          req.body
        );

      res.status(201).json(
        promotion
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getPromotions =
  async (req, res) => {
    try {
      const promotions =
        await Promotion.find({
          active: true,
        });

      res.json(promotions);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };