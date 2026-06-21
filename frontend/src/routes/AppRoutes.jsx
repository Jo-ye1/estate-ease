import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/pages/Home";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AddPropertyPage from "@/pages/AddPropertyPage";
import EditPropertyPage from "@/pages/EditPropertyPage";
import SearchPage from "@/pages/SearchPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import AboutPage from "@/pages/AboutPage";
import ReviewsPage from "@/pages/ReviewsPage";
import FAQPage from "@/pages/FAQPage";
import TermsPage from "@/pages/TermsPage";
import BlogDetailsPage from "../pages/BlogDetailsPage";
import MatrixSettingsPage from "@/pages/MatrixSettingPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import WelcomeSetup from "@/pages/WelcomeSetup";
import InboxPage from "../pages/InboxPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import LeadsDashboardPage from "@/pages/admin/LeadsDashboardPage";
import HowItWorks from "@/pages/HowItWorks";
import PricingPage from "@/pages/PricingPage";
import BillingPage from "@/pages/BillingPage";
import IntelligenceDashboardPage from "@/pages/IntelligenceDashboardPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AdminSubscriptionsPage from "@/pages/admin/AdminSubscriptionsPage";
import AdminBillingPage from "@/pages/admin/AdminBillingPage";
import AdminPropertyControlPage from "@/pages/admin/AdminPropertyControlPage";
import SellerDashboardPage from "@/pages/seller/SellerDashboardPage";
import AdminSystemHealthPage from "@/pages/admin/AdminSystemHealthPage";
import StandardAdminDashboardPage from "@/pages/admin/StandardAdminDashboardPage";
import AdminSettingsDashboard from "@/pages/MatrixSettingPage"; 
import AdminAlertCenterPage from "@/pages/admin/AdminAlertCenterPage";
import SellerRevenuePage from "@/pages/seller/SellerRevenuePage";
import MarketInsightsPage from "@/pages/seller/MarketInsightsPage";
import AgencyDashboardPage from "@/pages/agency/AgencyDashboardPage";
import AgentDashboardPage from "@/pages/agency/AgentDashboardPage";
import AdminKYCCenterPage from "@/pages/admin/AdminKYCCenterPage";
import PipelineKanban from "@/pages/agency/PipelineKanban";
import KycVerificationDesk from "@/pages/admin/KycVerificationDesk";
import CommissionDashboardPage from "@/pages/CommissionDashboardPage";
import ReportsDashboardPage from "@/pages/agency/ReportsDashboardpage";
import AuditChangelogPage from "@/pages/admin/AuditChangelogPage";
import UniversalProfilePage from "@/pages/UniversalProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="/terms-policy" element={<TermsPage />} />
      <Route path="/review" element={<ReviewsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog/:id" element={<BlogDetailsPage />} />
      <Route path="/welcome-setup" element={<WelcomeSetup />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/profile/:identifier" element={<UniversalProfilePage />} />



      <Route
        path="/seller-dashboard"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/billing"
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <PricingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/intelligence"
        element={
          <ProtectedRoute>
            <IntelligenceDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UniversalProfilePage />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user", "buyer"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-property"
        element={
          <ProtectedRoute allowedRoles={["seller", "agency", "admin", "super_admin"]}>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-property/:id"
        element={
          <ProtectedRoute allowedRoles={["seller", "agency", "admin", "super_admin"]}>
            <EditPropertyPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/leads"
        element={
          <ProtectedRoute allowedRoles={["seller", "agent", "agency", "admin", "super_admin"]}>
            <LeadsDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/leads"
        element={
          <ProtectedRoute allowedRoles={["owner", "seller", "agency", "admin"]}>
            <LeadsDashboardPage />
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/kyc-verification"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <KycVerificationDesk />
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StandardAdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/matrix-settings"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <MatrixSettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminSubscriptionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/billing"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminBillingPage />
          </ProtectedRoute>
        }
      />

        <Route
        path="/admin/matrix-settings"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminSettingsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/audit-logs"
  element={
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <AuditChangelogPage />
    </ProtectedRoute>
    }
    />


      <Route
        path="/admin/properties-control"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AdminPropertyControlPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/system-health"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminSystemHealthPage />
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/alerts"
  element={
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminAlertCenterPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/revenue"
  element={
    <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
      <SellerRevenuePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/market-insights"
  element={
    <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
      <MarketInsightsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/kyc-verification"
  element={
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminKYCCenterPage />
    </ProtectedRoute>
  }
/>

      <Route
        path="/pipeline"
        element={
          <ProtectedRoute allowedRoles={["agency", "agent"]}>
            <PipelineKanban />
          </ProtectedRoute>
        }
      />


      <Route
        path="/agency-dashboard"
        element={
          <ProtectedRoute allowedRoles={["agency"]}>
            <AgencyDashboardPage />
          </ProtectedRoute>
        }
      />




      <Route
        path="/agent-dashboard"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
