import Property from "../models/Property.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      listingType,
      propertyCategory,
      location,
      bedrooms,
      bathrooms,
      area,
      leaseDuration,
      maxGuests,
      availabilityStatus,
      pricing,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      listingType,
      propertyCategory,
      location,
      bedrooms,
      bathrooms,
      area,
      leaseDuration,
      maxGuests,
      availabilityStatus: availabilityStatus || "available",
      listingStatus: req.body.listingStatus || "draft",
      pricing,
      owner: req.user._id,
      images: [],
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const uploadPropertyImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    property.images.push(...imagePaths);

    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      listingType,
      type,
      propertyCategory,
      bedrooms,
      minPrice,
      maxPrice,
    } = req.query;

    const query = {
      listingStatus: "published",
    };

    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    const activeOperation = listingType || type;
    if (activeOperation && activeOperation !== "All" && activeOperation !== "all") {
      query.listingType = activeOperation.toLowerCase();
    }

    if (propertyCategory && propertyCategory !== "All" && propertyCategory !== "all") {
      query.propertyCategory = propertyCategory.toLowerCase();
    }

    if (bedrooms && bedrooms !== "All" && bedrooms !== "all") {
      query.bedrooms = Number(bedrooms);
    }

    if (minPrice || maxPrice) {
      const priceConditions = [
        {
          "pricing.salePrice": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
        {
          "pricing.monthlyRent": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
        {
          "pricing.dailyRate": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        }
      ];
      andConditions.push({ $or: priceConditions });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "name email avatar");

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const updatedProperty =
      await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("owner", "name email avatar");

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    for (const image of property.images) {
      const filename = image.split("/uploads/")[1];

      if (filename) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await property.deleteOne();

    res.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRelatedProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const related = await Property.find({
      _id: { $ne: property._id },
      listingStatus: "published",
      $or: [
        {
          propertyCategory:
            property.propertyCategory,
        },
        {
          location: {
            $regex: property.location,
            $options: "i",
          },
        },
      ],
    }).populate("owner", "name email avatar");

    res.json(related);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalProperties =
      await Property.countDocuments();

    const totalUsers =
      await mongoose.connection.db
        .collection("users")
        .countDocuments();

    const totalFavorites =
      await mongoose.connection.db
        .collection("favorites")
        .countDocuments();

    res.json({
      totalProperties,
      totalUsers,
      totalFavorites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePropertyStatus = async (
  req,
  res
) => {
  try {
    const { listingStatus } = req.body;

    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    property.listingStatus = listingStatus;

    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("owner", "name email avatar");

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    ).populate("owner", "name email avatar");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
