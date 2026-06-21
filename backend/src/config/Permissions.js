export const ROLE_PERMISSIONS = {
  super_admin: [
    "can_manage_team", "can_assign_leads", "can_view_revenue",
    "can_edit_listing", "can_view_leads", "can_close_deals",
    "can_bypass_gates", "can_purge_system"
  ],
  admin: [
    "can_manage_team", "can_assign_leads", "can_edit_listing",
    "can_view_leads", "can_close_deals"
  ],
  agency: [
    "can_manage_team", "can_assign_leads", "can_view_revenue",
    "can_edit_listing", "can_view_leads", "can_close_deals"
  ],
  seller: [
    "can_edit_listing", "can_view_leads", "can_close_deals"
  ],
  agent: [
    "can_edit_listing", "can_view_leads", "can_close_deals"
  ],
  user: [],
  buyer: []
};
