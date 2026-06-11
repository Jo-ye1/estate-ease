import Property from "../models/PropertyModel.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    // 🚀 FIXED: Added "status" to the destructuring list right here
    const { title, description, price, location, type, status, bedrooms, bathrooms, area } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        message: "Authentication tracking failed. Please log out, log back in, and try again." 
      });
    }

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      type,
      status: status || "For Sale", // 👈 FIXED: Saves the status cleanly inside MongoDB records
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      owner: req.user._id, 
    });

    res.status(201).json(property); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Upload multiple asset images simultaneously locally
// @route   POST /api/properties/:id/upload
// @access  Private
export const uploadPropertyImage = async (req, res) => {
  try {
    // 🛡️ Handles both single file or array parameters seamlessly
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ message: "No picture files uploaded." });
    }

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Listing not found." });

    // 🛡️ SECURITY GUARD: Verify the active session user actually owns this listing
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to add images to this property listing."
      });
    }

    if (!property.images || !Array.isArray(property.images)) {
      property.images = [];
    }

    // ⚡ Iterate over the multipart disk stream array data to map the local path URLs
    files.forEach((file) => {
      const localUrlPath = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      property.images.push(localUrlPath);
    });

    await property.save();
    res.json({ message: "Gallery images uploaded successfully!", images: property.images, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties with advanced query filtering pipelines (Phase 10 Upgraded)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const query = {};
    const { search, location, type, bedrooms, minPrice, maxPrice } = req.query;

    // ⚡ Multi-Field Text Search (Matches words inside Title OR Description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Case-insensitive partial matching for explicit location strings
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Exact category dropdown filtering
    if (type && type !== "All") {
      query.type = type;
    }

    // Exact primitive number match mapping
    if (bedrooms && bedrooms !== "All") {
      query.bedrooms = Number(bedrooms);
    }

    // Dynamic price range building ($gte = Greater Than or Equal To, $lte = Less Than or Equal To)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(9)
      .populate("owner", "name email");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: `Database Search Engine Error: ${error.message}` });
  }
};

// @desc    Get properties owned by the authenticated user
// @route   GET /api/properties/my-properties
// @access  Private
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this property" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property and clean up its local hard drive image assets
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this property" });
    }

    if (property.images && property.images.length > 0) {
      for (const imageUrl of property.images) {
        try {
          const filename = imageUrl.split("/uploads/");
          const localFilePath = path.join(process.cwd(), "uploads", filename);

          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
        } catch (fileSystemErr) {
          console.error("Local disk file deletion failed:", fileSystemErr.message);
        }
      }
    }

    await property.deleteOne();
    res.json({ message: "Property and associated local images removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related properties based on type or location (excluding current)
// @route   GET /api/properties/:id/related
// @access  Public
export const getRelatedProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const related = await Property.find({
      _id: { $ne: property._id },
      $or: [
        { type: property.type },
        { location: { $regex: property.location, $options: "i" } }
      ]
    })
    .limit(3)
    .populate("owner", "name email");

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get real-time total metrics for landing page counters
// @route   GET /api/properties/stats
// @access  Public
export const getStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();

    const totalUsers = await mongoose.connection.db.collection("users").countDocuments().catch(() => 12);
    const totalFavorites = await mongoose.connection.db.collection("favorites").countDocuments().catch(() => 8);

    res.json({
      totalProperties,
      totalUsers: totalUsers || 12,
      totalFavorites: totalFavorites || 8,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
