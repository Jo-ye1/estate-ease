import Property from "../models/Property.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import SearchLog from "../models/SearchLog.js";
import Notification from "../models/Notification.js";

import { 
  initializePropertyAnalytics, 
  trackPropertyView, 
  trackApprovalSubmission, 
  trackPublishDate 
} from "../services/propertyAnalyticsService.js";

import Favorite from "../models/Favorite.js"; 


import { createAuditLog } from "../services/auditService.js";
import Subscription from "../models/Subscription.js";
import { PLANS } from "../config/plans.js"; 
import { logRevenue } from "../services/revenueService.js";
import { createNotification } from "../utils/createNotification.js";


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
      listingStatus: "pending", 
      pricing,
      owner: req.user._id,
      images: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isExpired: false,
      renewalStatus: "active",
      lastRenewalDate: new Date()
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

    await createNotification({
  type: "PROPERTY_SUBMITTED",
  title: "New Property Awaiting Review",
  message: `A seller submitted the listing "${property.title}" for validation check protocols.`,
  relatedId: property._id,
  relatedType: "Property"
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

    SearchLog.create({
      user: req.user?._id || null, 
      keyword: search || null,                  
      location: location || null,
      category: propertyCategory || null,       
      operation: listingType || type || null,   
      bedrooms: bedrooms && bedrooms !== "All" && bedrooms !== "all" ? Number(bedrooms) : null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    }).catch(err => console.error("Search logging failed:", err)); 

    const query = {
      listingStatus: "published",
      availabilityStatus: "available",
      isExpired: false,
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
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    let property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized access block." });
    }

    const isModerator = ["admin", "super_admin"].includes(String(req.user.role).toLowerCase());

    // 🟢 LOOP BREAKER RULE 2: Any modifications made by a seller reset the status back to pending
    const updateData = { ...req.body };
    if (!isModerator) {
      updateData.listingStatus = "pending";
    }

    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    const isModerator = ["admin", "super_admin"].includes(String(req.user.role).toLowerCase());

    // 🟢 LOOP BREAKER RULE 1: If a non-admin tries to force-publish an item, hijack it and set it to pending
    let targetStatus = status;
    if (targetStatus === "published" && !isModerator) {
      targetStatus = "pending";
    }

    property.listingStatus = targetStatus;
    await property.save();

    res.json({ 
      success: true, 
      message: isModerator ? `Listing updated to ${targetStatus}` : "Listing submitted to admin moderation queue.", 
      property 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property listing asset not found" });
    }

    property.listingStatus = "published";
    property.approvedBy = req.user._id;
    property.approvedAt = new Date();
    await property.save();

    const populatedOwner = await mongoose.model("User").findById(property.owner);
    if (populatedOwner?.email) {
      await sendMarketplaceEmail({
        to: populatedOwner.email,
        subject: "Your listing is now live!",
        text: `Congratulations ${populatedOwner.name},\n\nYour marketplace property posting "${property.title}" has passed system moderation check protocols and is now streaming live inside buyer search grids.`
      });
    }

    try {
      await createNotification({
        recipient: property.owner, 
        type: "property",
        title: "Listing Approved Live!",
        message: `Your property "${property.title}" has passed marketplace moderation check protocols.`,
        relatedId: property._id,
        relatedType: "Property"
      });
    } catch (notifErr) {
      console.error("Alert background trace dispatch failed:", notifErr.message);
    }

    res.json({ success: true, message: "Property approved and published live.", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property asset row not found" });
    }

    property.listingStatus = "rejected";
    property.rejectedReason = reason || "Listing failed platform description criteria policies.";
    await property.save();

    const populatedOwner = await mongoose.model("User").findById(property.owner);
    if (populatedOwner?.email) {
      await sendMarketplaceEmail({
        to: populatedOwner.email,
        subject: "Action required on your listing",
        text: `Hello ${populatedOwner.name},\n\nYour property posting "${property.title}" was declined during moderation checks. Reason: ${property.rejectedReason || "Failed description criteria guidelines."}. Adjust parameters and resubmit for evaluation.`
      });
    }

    try {
      await createNotification({
        recipient: property.owner,
        type: "property",
        title: "Listing Rejected",
        message: `Moderation updates: "${property.title}" was declined. Reason: ${property.rejectedReason}`,
        relatedId: property._id,
        relatedType: "Property"
      });
    } catch (notifErr) {
      console.error("Alert fallback failed:", notifErr.message);
    }

    res.json({ success: true, message: "Property listing marked rejected and stored in archive.", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    const isModerator = ["admin", "super_admin"].includes(String(req.user.role).toLowerCase());

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: "Unauthorized permission block." });
    }

    property.listingStatus = "archived";
    await property.save();

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_SOFT_DELETED",
      targetType: "Property",
      targetId: id,
      metadata: { title: property.title }
    });

    res.json({ success: true, message: "Property moved to soft-deleted archive storage." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const restoreProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.listingStatus = "pending";
    await property.save();

    res.json({ success: true, message: "Property listing restored back to the pending moderation queue.", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminGlobalProperties = async (req, res) => {
  try {
    // 🟢 ABSOLUTE UNRESTRICTED DATA LOOP: Fetches everything for moderation analysis
    const properties = await Property.find({})
      .populate("owner", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const renewPropertyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this listing asset." });
    }

    property.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    property.isExpired = false;
    property.listingStatus = "pending"; 
    property.renewalStatus = "active";
    property.lastRenewalDate = new Date();
    property.reminderLogs = [];

    await property.save();

    await createAuditLog({
      actor: req.user._id,
      action: "PROPERTY_RENEWED",
      targetType: "Property",
      targetId: id,
      metadata: { title: property.title }
    });

    res.json({
      success: true,
      message: "Property listing successfully extended and returned to the admin moderation queue.",
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const uploadKycDocumentAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No document attached to request multi-part stream." });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    res.json({ success: true, fileUrl: fileUrl, url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};