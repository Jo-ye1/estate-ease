import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    eventType: {
      type: String,
      enum: [
        "meeting",
        "property_visit",
        "call",
        "follow_up",
        "deadline",
        "inspection",
        "contract_signing"
      ],
      default: "meeting"
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "missed"],
      default: "scheduled"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

calendarEventSchema.index({ agencyId: 1 });
calendarEventSchema.index({ assignedTo: 1 });
calendarEventSchema.index({ startDate: 1 });

export default mongoose.model("CalendarEvent", calendarEventSchema);