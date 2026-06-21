import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";
import { logLeadTimeline } from "../utils/logLeadTimeline.js";
import { getIO } from "../socket/socket.js";

export const moveLeadStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const LeadModel = mongoose.model("Lead");
    const LeadTaskModel = mongoose.model("LeadTask");
    const AgencyModel = mongoose.model("Agency");

    const lead = await LeadModel.findById(req.params.id).populate("property");
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const previousStage = lead.pipelineStage;
    lead.pipelineStage = stage;
    lead.lastStageUpdatedAt = new Date();

    lead.stageHistory.push({
      stage,
      movedBy: req.user._id
    });

    await lead.save();

    // 🟢 PIPELINE LATEST RECONCILIATION: Append chronological ledger tracker updates
    await logLeadTimeline({
      lead: lead._id,
      actor: req.user._id,
      action: "Stage Changed",
      description: `Lead state advanced from "${previousStage}" column lane into "${stage}" layer.`
    });

    // ⚡ AUTOMATION TRIGGER 1: Viewing Scheduled ➔ Auto Create Operational Triage Task
    if (stage === "viewing") {
      const extensionDate = new Date();
      extensionDate.setDate(extensionDate.getDate() + 1);

      await LeadTaskModel.create({
        lead: lead._id,
        assignedTo: lead.assignedAgent || lead.owner,
        title: "Prepare Property Viewing Tour Portfolio",
        description: `Automated: Conduct checklist confirmation and client brief preparation for property "${lead.property?.title || 'Listing Asset'}".`,
        priority: "high",
        dueDate: extensionDate,
        status: "pending"
      });

      await logLeadTimeline({
        lead: lead._id,
        actor: req.user._id,
        action: "Viewing Scheduled",
        description: "Viewing task checklist auto-injected into handling executive assignment roster."
      });
    }

    // ⚡ AUTOMATION TRIGGER 2: Offer/Contract Signed ➔ Auto Pipeline Transition Hook
    if (stage === "contract") {
      await logLeadTimeline({
        lead: lead._id,
        actor: req.user._id,
        action: "Contract Signed",
        description: "Legal transaction binder documentation generated and pushed for corporate settlement signatures."
      });
    }

    // ⚡ AUTOMATION TRIGGER 3: Closed Won ➔ Settle Financial Balances & Log System Allocation Records
    if (stage === "closed") {
      const agency = await AgencyModel.findOne({ 
        $or: [{ ownerId: req.user._id }, { agents: req.user._id }] 
      });

      let propertyValue = 0;
      if (lead.property?.pricing) {
        propertyValue = lead.property.pricing.salePrice || lead.property.pricing.monthlyRent || lead.property.pricing.dailyRate || 0;
      }

      const activePlatformSplitRate = agency?.commissionRate || 5.0;
      const computedBrokerageCut = (propertyValue * activePlatformSplitRate) / 100;

      // Fires your revenue logger module automatically inside your pipeline loop
      const RevenueModel = mongoose.models.Revenue || mongoose.model("Revenue", new mongoose.Schema({}, { strict: false }));
      await RevenueModel.create({
        user: lead.assignedAgent || lead.owner,
        property: lead.property?._id,
        leadId: lead._id,
        amount: computedBrokerageCut,
        type: "commission_split",
        source: "property_transaction",
        status: "cleared"
      });

      await logAgentActivity({
        agencyId: agency?._id || req.user._id,
        agentId: lead.assignedAgent || lead.owner,
        actionType: "commission_paid",
        title: "Commission Record Generated",
        description: `Split allocation of $${computedBrokerageCut.toLocaleString()} cleared for closure transaction on "${lead.property?.title || 'Asset'}".`,
        relatedId: lead._id,
        relatedType: "Lead"
      });
    }

    // ⚡ AUTOMATION TRIGGER 4: Lost Dropouts ➔ Reactivation Campaign Dispatch Hooks
    if (stage === "lost") {
      const EmailService = await import("../utils/emailService.js").catch(() => null);
      if (EmailService?.sendMarketplaceEmail && lead.email) {
        await EmailService.sendMarketplaceEmail({
          to: lead.email,
          subject: "We value your property journey - Estate Ease Portfolio updates",
          text: `Hello ${lead.name || "Valued Client"},\n\nWe noticed your inquiry tracking on "${lead.property?.title || 'Marketplace Item'}" was marked closed. If your criteria parameters altered, log into your personal hub workspace to view personalized recommendations matching your target metrics.\n\nBest Regards,\nEstate Operations Matrix`
        }).catch(err => console.error("Reactivation campaign deferred:", err.message));
      }
    }

    // Standard Real-time Notification dispatch mappings
    if (lead.assignedAgent && lead.assignedAgent.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: lead.assignedAgent,
        sender: req.user._id,
        type: "LEAD_STAGE_UPDATED",
        title: "Lead Status Modified",
        message: `Lead "${lead.name}" moved from ${previousStage} to ${stage}`,
        relatedId: lead._id,
        relatedType: "Lead"
      });
    }

    await logAgentActivity({
      agencyId: req.user.agencyId || agency?._id,
      agentId: req.user._id,
      actionType: "lead_stage_changed",
      title: "Lead Stage Updated",
      description: `Lead moved from ${previousStage} to ${stage}`,
      relatedId: lead._id,
      relatedType: "Lead",
      metadata: { previousStage, newStage: stage }
    });

    try {
      const io = getIO();
      if (io) io.emit("pipeline:update");
    } catch (wsErr) {
      console.error("Socket error skipped:", wsErr.message);
    }

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPipeline = async (req, res) => {
  try {
    const LeadModel = mongoose.model("Lead");
    const { search, priority, source } = req.query;

    const matchQuery = { owner: req.user._id };

    if (priority && priority !== "all") {
      matchQuery.priority = priority;
    }
    if (source && source !== "all") {
      matchQuery.source = source;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      matchQuery.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { message: regex }
      ];
    }

    const leads = await LeadModel.find(matchQuery)
      .populate("buyer", "name email phone")
      .populate("property", "title pricing listingType location")
      .populate("assignedAgent", "name email");

    const pipeline = { new: [], contacted: [], viewing: [], negotiation: [], offer: [], contract: [], closed: [], lost: [] };
    
    leads.forEach((lead) => {
      if (pipeline[lead.pipelineStage]) {
        pipeline[lead.pipelineStage].push(lead);
      }
    });

    res.json({ success: true, pipeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
