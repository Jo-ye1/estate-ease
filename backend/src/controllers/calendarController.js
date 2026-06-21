import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";
import { getIO } from "../socket/socket.js";

export const createCalendarEvent = async (req, res) => {
  try {
    const Agency = mongoose.model("Agency");
    const CalendarEvent = mongoose.model("CalendarEvent");

    const agency = await Agency.findOne({
      ownerId: req.user._id
    });

    const event = await CalendarEvent.create({
      ...req.body,
      agencyId: agency._id,
      createdBy: req.user._id
    });

    if (event.assignedTo) {
      await createNotification({
        recipient: event.assignedTo,
        type: "CALENDAR_EVENT_ASSIGNED",
        title: "New Calendar Event",
        message: `New event assigned: ${event.title}`,
        relatedId: event._id,
        relatedType: "CalendarEvent"
      });

      await logAgentActivity({
        agentId: event.assignedTo,
        actionType: "calendar_created",
        referenceId: event._id,
        referenceType: "CalendarEvent",
        performedBy: req.user._id
      });
    }

    const io = getIO();
    io.to(`agency_${agency._id}`).emit("calendar:update", event);

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyCalendarEvents = async (req, res) => {
  try {
    const CalendarEvent = mongoose.model("CalendarEvent");

    const events = await CalendarEvent.find({
      assignedTo: req.user._id
    })
      .populate("leadId")
      .populate("propertyId")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAgencyCalendarEvents = async (req, res) => {
  try {
    const Agency = mongoose.model("Agency");
    const CalendarEvent = mongoose.model("CalendarEvent");

    const agency = await Agency.findOne({
      ownerId: req.user._id
    });

    const events = await CalendarEvent.find({
      agencyId: agency._id
    })
      .populate("assignedTo", "name email")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSingleCalendarEvent = async (req, res) => {
  try {
    const CalendarEvent = mongoose.model("CalendarEvent");

    const event = await CalendarEvent.findById(req.params.id)
      .populate("assignedTo")
      .populate("leadId")
      .populate("propertyId");

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateCalendarEvent = async (req, res) => {
  try {
    const CalendarEvent = mongoose.model("CalendarEvent");

    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const io = getIO();
    io.emit("calendar:update", event);

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const CalendarEvent = mongoose.model("CalendarEvent");

    await CalendarEvent.findByIdAndDelete(req.params.id);

    const io = getIO();
    io.emit("calendar:delete", req.params.id);

    res.json({
      success: true,
      message: "Calendar event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};