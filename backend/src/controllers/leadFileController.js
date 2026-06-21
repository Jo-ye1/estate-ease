import mongoose from "mongoose";

export const getLeadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadFileModel = mongoose.model("LeadFile");

    const files = await LeadFileModel.find({ lead: id })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadLeadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadModel = mongoose.model("Lead");
    const LeadFileModel = mongoose.model("LeadFile");

    const lead = await LeadModel.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Target lead document not found." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No document attached to request stream." });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const fileRecord = await LeadFileModel.create({
      lead: id,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
    });

    const populatedFile = await LeadFileModel.findById(fileRecord._id).populate("uploadedBy", "name email role");

    res.status(201).json({ success: true, file: populatedFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLeadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadFileModel = mongoose.model("LeadFile");

    const fileRecord = await LeadFileModel.findById(id);
    if (!fileRecord) {
      return res.status(404).json({ message: "Target file element not found." });
    }

    await LeadFileModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Lead compliance document purged successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
