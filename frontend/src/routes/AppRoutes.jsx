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
// Add or uncomment this line inside src/routes/AppRoutes.jsx
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import AboutPage from "@/pages/AboutPage";
import ReviewsPage from "@/pages/ReviewsPage"; 
import FAQPage from "@/pages/FAQPage";
import TermsPage from "@/pages/TermsPage";

// 👑 1. Import your matching page name (MatrixSettingPage)
import MatrixSettingsPage from '@/pages/MatrixSettingPage'; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================================================
          PUBLIC GUEST ROUTES
         ========================================================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/search" element={<SearchPage />} /> 
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="/terms-policy" element={<TermsPage />} />
      <Route path="/review" element={<ReviewsPage />} /> 
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* =========================================================
          PROTECTED PRIVATE ROUTES LAYER BOUNDARIES
         ========================================================= */}
      
      {/* 👤 Profile Settings View */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage /> 
          </ProtectedRoute>
        } 
      />

      {/* ❤️ Favorites/Bookmarks Page */}
      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 🏢 1. Property Owner & Seller listings metrics layout dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <DashboardPage /> 
          </ProtectedRoute>
        } 
      />
      
      {/* ➕ Create Listing form path workspace */}
      <Route 
        path="/add-property" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <AddPropertyPage />
          </ProtectedRoute>
        } 
      />

      {/* 🛠️ Edit Listing values metadata parameters forms */}
      <Route 
        path="/edit-property/:id" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <EditPropertyPage />
          </ProtectedRoute>
        } 
      />

      {/* 👑 2. Admin User Accounts Manager Profiles Dashboard */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* ⚙️ 3. Admin Content System Matrix Settings Tabs View Page */}
      <Route 
        path="/admin/matrix-settings" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MatrixSettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* =========================================================
          FALLBACK REDIRECT CATCH
         ========================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
