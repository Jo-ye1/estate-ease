import Property from "../models/PropertyModel.js";
import fs from "fs";
import path from "path";

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, type, bedrooms, bathrooms, area } = req.body;

    // 🛡️ Fail-safe safeguard check for missing user authentication headers
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        message: "Authentication tracking failed. Please log out, log back in, and try again." 
      });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      type,
      bedrooms,
      bathrooms,
      area,
      owner: req.user._id, // Links the listing safely to the verified user session
    });

    res.status(201).json(property); 
  } catch (error) {
    // 🛡️ Safe fallback response style to catch data formatting input issues
    res.status(400).json({ message: error.message });
  }
};

// @desc    Upload an image for a property locally
// @route   POST /api/properties/:id/upload
// @access  Private
export const uploadPropertyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Defensive safeguard initializes the images array field if it's completely missing or undefined
    if (!property.images) {
      property.images = [];
    }

    // Formats path smoothly into an accessible URL format string (e.g., http://localhost:5000/uploads/filename.jpg)
    const localUrlPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    property.images.push(localUrlPath);
    await property.save();

    res.json({
      message: "Image uploaded locally successfully",
      image: localUrlPath,
      property,
    });
  } catch (error) {
    console.error("CRITICAL LOCAL UPLOAD CONTROLLER ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // 🧹 Automated local hard drive disk media cleanup
    if (property.images && property.images.length > 0) {
      for (const imageUrl of property.images) {
        try {
          // Extracts the plain filename from the URL string structure
          const filename = imageUrl.split("/uploads/")[1];
          const localFilePath = path.join(process.cwd(), "uploads", filename);

          // If the image file exists on disk, delete it natively
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
