import Property from "../models/Property.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { 
  initializePropertyAnalytics, 
  trackPropertyView, 
  trackApprovalSubmission, 
  trackPublishDate 
} from "../services/propertyAnalyticsService.js";

import Favorite from "../models/Favorite.js"; // 🟢 ADDED THIS IMPORT AT THE TOP


import { createAuditLog } from "../services/auditService.js";
import Subscription from "../models/Subscription.js";
import { PLANS } from "../config/plans.js"; 
import { logRevenue } from "../services/revenueService.js";


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

    const sub = await Subscription.findOne({
      user: req.user._id,
    });

    const plan = PLANS[sub?.plan || "free"];

    const propertyCount = await Property.countDocuments({
      owner: req.user._id,
    });

    if (
      plan.maxProperties !== -1 &&
      propertyCount >= plan.maxProperties
    ) {
      return res.status(403).json({
        message: "Property limit reached. Upgrade plan.",
      });
    }

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

    await initializePropertyAnalytics(property._id);

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_CREATED",
      targetType: "Property",
      targetId: property._id,
      metadata: {
        title: property.title,
      },
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

    if (property.owner.toString() !== req.user._id.toString()) {
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

    // 🟢 THE ABSOLUTE FIX: Overwrite the images array completely so old files can't cause conflicts
    property.images = imagePaths; 

    await property.save();

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_IMAGES_UPLOADED",
      targetType: "Property",
      targetId: property._id,
      metadata: {
        count: req.files.length,
      },
    });

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
      listingStatus: { $in: ["published", "available", "Available", "Published"] },
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
      .sort({
        boostScore: -1,
        isFeatured: -1,
        createdAt: -1,
      })
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

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 🟢 FIXED: Directly update the document using req.body with no array stripping hooks
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email avatar");

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_UPDATED",
      targetType: "Property",
      targetId: updatedProperty._id,
    });

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

    // 🟢 THE FIX: Delete all user favorite bookmarks pointing to this property to lower favorite metrics instantly
    await Favorite.deleteMany({ property: property._id });

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

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_DELETED",
      targetType: "Property",
      targetId: property._id,
    });

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

    // 2. HOOK B: Track the view using the found property ID
    await trackPropertyView(property._id);

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const submitPropertyForReview = async (req, res) => {
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
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    property.listingStatus = "pending";

    await property.save();

    // 🟢 ANALYTICS HOOK: Track the approval submission date milestone
    await trackApprovalSubmission(property._id);

    await AuditLog.create({
      actor: req.user._id,
      action: "PROPERTY_SUBMITTED",
      targetId: property._id,
      targetType: "Property",
      message: `${property.title} submitted for review`,
    });

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    property.listingStatus = "rejected";
    property.rejectedReason = reason || "No reason provided";

    await property.save();

    await AuditLog.create({
      actor: req.user._id,
      action: "PROPERTY_REJECTED",
      targetId: property._id,
      targetType: "Property",
      message: `${property.title} rejected`,
    });

    await createNotification({
      recipient: property.owner,
      sender: req.user._id,
      type: "PROPERTY_REJECTED",
      title: "Property Rejected",
      message: `${property.title} was rejected`,
      relatedId: property._id,
      relatedType: "Property",
    });

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    property.listingStatus = "published";
    property.approvedBy = req.user._id;
    property.approvedAt = new Date();
    property.rejectedReason = "";

    await property.save();

    // 🟢 ANALYTICS HOOK: Track the public publish date milestone
    await trackPublishDate(property._id);

    await AuditLog.create({
      actor: req.user._id,
      action: "PROPERTY_APPROVED",
      targetId: property._id,
      targetType: "Property",
      message: `${property.title} approved`,
    });

    await createNotification({
      recipient: property.owner,
      sender: req.user._id,
      type: "PROPERTY_APPROVED",
      title: "Property Approved",
      message: `${property.title} has been approved`,
      relatedId: property._id,
      relatedType: "Property",
    });

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
