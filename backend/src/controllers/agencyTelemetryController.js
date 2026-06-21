import mongoose from "mongoose";

export const getAgencyComprehensiveAnalytics = async (req, res) => {
  try {
    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");
    const LeadTaskModel = mongoose.model("LeadTask");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(404).json({ message: "Brokerage corporate profiling parameters not found matching session tracking." });
    }

    const teamAccountIds = [req.user._id, ...agency.agents];

    // Part 17: Widget Metric Compilation Overview Lookups
    const leadsInScope = await LeadModel.find({ owner: { $in: teamAccountIds } }).populate("property");
    
    const kpis = {
      revenue: 0,
      conversion: 0,
      activeLeads: 0,
      closedDeals: 0,
      lostLeads: 0,
      avgResponseMinutes: 0
    };

    const funnelBreakdown = { new: 0, contacted: 0, viewing: 0, negotiation: 0, offer: 0, contract: 0, closed: 0, lost: 0 };
    let totalLatencyMs = 0;
    let leadsWithLatencyCount = 0;

    leadsInScope.forEach(lead => {
      const stage = lead.pipelineStage || "new";
      if (funnelBreakdown[stage] !== undefined) funnelBreakdown[stage]++;

      if (!["closed", "lost"].includes(stage)) kpis.activeLeads++;
      if (stage === "closed") {
        kpis.closedDeals++;
        if (lead.property?.pricing) {
          kpis.revenue += lead.property.pricing.salePrice || lead.property.pricing.monthlyRent || lead.property.pricing.dailyRate || 0;
        }
      }
      if (stage === "lost") kpis.lostLeads++;

      if (lead.contactedAt && lead.createdAt) {
        totalLatencyMs += new Date(lead.contactedAt).getTime() - new Date(lead.createdAt).getTime();
        leadsWithLatencyCount++;
      }
    });

    kpis.conversion = leadsInScope.length > 0 ? parseFloat(((kpis.closedDeals / leadsInScope.length) * 100).toFixed(1)) : 0;
    kpis.avgResponseMinutes = leadsWithLatencyCount > 0 ? Math.round(totalLatencyMs / (1000 * 60 * leadsWithLatencyCount)) : 0;

    // Part 18: Funnel Analytics Advanced Drop-off Metrics Generation Logic Loop
    const pipelineSequenceOrder = ["new", "contacted", "viewing", "negotiation", "offer", "contract", "closed"];
    const funnelReportArray = pipelineSequenceOrder.map((stageId, index) => {
      const currentCount = funnelBreakdown[stageId];
      const previousCount = index > 0 ? funnelBreakdown[pipelineSequenceOrder[index - 1]] : currentCount;
      const dropOffPercent = previousCount > 0 ? parseFloat((((previousCount - currentCount) / previousCount) * 100).toFixed(1)) : 0;
      
      return {
        stage: stageId,
        volume: currentCount,
        dropOffRate: index === 0 ? 0 : Math.max(0, dropOffPercent)
      };
    });

    // Part 16: Dynamic Roster Workload Allocation Analytics Performance Board Matrix Lookup
    const AgentProfileModel = mongoose.model("AgentProfile");
    const teamProfiles = await AgentProfileModel.find({ agencyId: agency._id }).populate("userId", "name email");

    const rosterWorkloadMetrics = await Promise.all(teamProfiles.map(async (profile) => {
      if (!profile.userId) return null;
      
      const agentLeads = leadsInScope.filter(l => l.assignedAgent?.toString() === profile.userId._id.toString());
      const agentTasks = await LeadTaskModel.countDocuments({ assignedTo: profile.userId._id, status: "pending" });
      const closedCount = agentLeads.filter(l => l.pipelineStage === "closed").length;
      
      let agentLatencyTotal = 0;
      let agentLatencyCount = 0;
      agentLeads.forEach(l => {
        if (l.contactedAt) {
          agentLatencyTotal += new Date(l.contactedAt).getTime() - new Date(l.createdAt).getTime();
          agentLatencyCount++;
        }
      });

      return {
        agentName: profile.userId.name,
        email: profile.userId.email,
        allocatedLeads: agentLeads.length,
        pendingTasks: agentTasks,
        dealsClosed: closedCount,
        avgResponseMinutes: agentLatencyCount > 0 ? Math.round(agentLatencyTotal / (1000 * 60 * agentLatencyCount)) : 0,
        conversionRate: agentLeads.length > 0 ? parseFloat(((closedCount / agentLeads.length) * 100).toFixed(1)) : 0
      };
    }));

    res.json({
      success: true,
      widgets: kpis,
      funnel: {
        stages: funnelReportArray,
        globalWinRate: kpis.conversion
      },
      workload: rosterWorkloadMetrics.filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
