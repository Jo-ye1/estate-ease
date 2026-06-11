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
import ReviewsPage from "@/pages/ReviewsPage"; // 🎯 FIXED: Clean, singular import from your new pages directory

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
      
      {/* 🎯 FIXED ROUTE: Mounts your new ReviewsPage component at the requested /review path */}
      <Route path="/review" element={<ReviewsPage />} /> 
      
      <Route path="/blog" element={<BlogPage />} />

      {/* =========================================================
          PROTECTED PRIVATE ROUTES LAYER BOUNDARIES
         ========================================================= */}
      
      {/* 👤 Profile Path (Normal buyers view their own profile/bookmarks here) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage /> 
          </ProtectedRoute>
        } 
      />

      {/* ❤️ Favorites/Bookmarks Page Protection */}
      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 📊 Broker Dashboard (Restricted from basic buyers) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <DashboardPage /> 
          </ProtectedRoute>
        } 
      />
      
      {/* ➕ Create Listing Path */}
      <Route 
        path="/add-property" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <AddPropertyPage />
          </ProtectedRoute>
        } 
      />

      {/* 🛠️ Edit Listing Path (Role validation added safely here) */}
      <Route 
        path="/edit-property/:id" 
        element={
          <ProtectedRoute allowedRoles={["seller", "broker", "admin"]}>
            <EditPropertyPage />
          </ProtectedRoute>
        } 
      />

      {/* 👑 MASTER ADMIN SYSTEM CONTROL MATRIX PROTECTION GUARD PATH */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      {/* =========================================================
          FALLBACK REDIRECT CATCH
         ========================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
