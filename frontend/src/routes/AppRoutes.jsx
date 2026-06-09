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
import SearchPage from "@/pages/SearchPage"; // 👈 C2: Search Results Page imported cleanly
import AboutUs from "../components/home/AboutUs";
import Testimonials from "../components/home/Testimonials";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Guest Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/search" element={<SearchPage />} /> {/* 👈 C2: Public search results route mapping */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/testimonials" element={<Testimonials />} />

      {/* Protected Private Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-property" 
        element={
          <ProtectedRoute>
            <AddPropertyPage />
          </ProtectedRoute>
        } 
      />
      {/* 🛠️ B1 — Dynamic Edit Route added precisely here */}
      <Route 
        path="/edit-property/:id" 
        element={
          <ProtectedRoute>
            <EditPropertyPage />
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
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Safe Fallback Redirect Catch */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
