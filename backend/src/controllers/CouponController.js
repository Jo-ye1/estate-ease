import Coupon from "../models/Coupon.js";

export const validateCoupon =
  async (req, res) => {
    try {
      const { code } =
        req.body;

      const coupon =
        await Coupon.findOne({
          code,
          active: true,
        });

      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Invalid coupon",
          });
      }

      if (
        coupon.expiresAt <
        new Date()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Coupon expired",
          });
      }

      if (
        coupon.usedCount >=
        coupon.usageLimit
      ) {
        return res
          .status(400)
          .json({
            message:
              "Coupon exhausted",
          });
      }

      res.json(coupon);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };