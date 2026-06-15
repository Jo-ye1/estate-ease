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

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
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

      {/* ================= PROTECTED ROUTES ================= */}

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
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-property"
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-property/:id"
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <EditPropertyPage />
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

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}