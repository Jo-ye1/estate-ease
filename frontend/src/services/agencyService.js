import express from "express";
import { 
  registerAgencyBrokerage, 
  inviteAndOnboardSubAgent,
  getAgencyTeam,
  inviteAgentToAgency,
  updateAgentAvailability
} from "../controllers/agencyController.js";
import { assignPropertyToAgent, assignLeadToAgent } from "../controllers/assignmentController.js";
import { executeDealCommissionSplit } from "../controllers/commissionController.js";
import { getAgencyTeamAnalytics } from "../controllers/teamAnalyticsController.js";
import { computeAgentPerformanceRankings } from "../controllers/rankingController.js";
import { sendInternalAgencyMessage, getInternalAgencyFeed } from "../controllers/agencyChatController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { requireCapability } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.post("/onboard-firm", protect, registerAgencyBrokerage);
router.post("/onboard-agent", protect, requireCapability("can_manage_team"), inviteAndOnboardSubAgent);
router.put("/assign-property", protect, requireCapability("can_assign_leads"), assignPropertyToAgent);
router.put("/assign-lead", protect, requireCapability("can_assign_leads"), assignLeadToAgent);
router.post("/settle-commission", protect, requireCapability("can_view_revenue"), executeDealCommissionSplit);
router.get("/team-intelligence", protect, requireCapability("can_view_revenue"), getAgencyTeamAnalytics);
router.post("/chat/send", protect, authorizeRoles("agency", "agent"), sendInternalAgencyMessage);
router.get("/chat/feed", protect, authorizeRoles("agency", "agent"), getInternalAgencyFeed);
router.post("/recalculate-rankings", protect, authorizeRoles("agency", "admin", "super_admin"), computeAgentPerformanceRankings);

router.get("/team", protect, getAgencyTeam);
router.post("/invite-agent", protect, inviteAgentToAgency);
router.put("/agent/:agentId/availability", protect, updateAgentAvailability);

export default router;
