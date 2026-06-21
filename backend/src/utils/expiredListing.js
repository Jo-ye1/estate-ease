import Property from "../models/Property.js";

export const expireListings =
  async () => {
    const now = new Date();

    await Property.updateMany(
      {
        expiresAt: {
          $lt: now,
        },
        listingStatus: "published",
      },
      {
        listingStatus: "expired",
      }
    );
  };

  export const republishListings =
  async () => {
    const expired =
      await Property.find({
        listingStatus: "expired",
      });

    for (const property of expired) {
      const newExpiry = new Date();
      newExpiry.setDate(
        newExpiry.getDate() + 30
      );

      property.listingStatus =
        "published";

      property.expiresAt =
        newExpiry;

      await property.save();
    }
  };