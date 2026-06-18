import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/pages/Home";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
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
          <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-property"
        element={
          <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-property/:id"
        element={
          <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
            <EditPropertyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute allowedRoles={["seller", "admin", "super_admin"]}>
            <LeadsDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/leads"
        element={
          <ProtectedRoute allowedRoles={["owner", "seller", "admin"]}>
            <LeadsDashboardPage />
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/admin-dashboard"
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
