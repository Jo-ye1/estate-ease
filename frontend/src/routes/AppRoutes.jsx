import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/pages/Home";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/pages/Dashboard"; // Updated to clean naming standard
import ProtectedRoute from "./ProtectedRoute";

import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import AddPropertyPage from "@/pages/AddPropertyPage"; // Added AddPropertyPage import
import AboutUs from "../components/home/AboutUs";
import Testimonials from "../components/home/Testimonials";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/signup" element={<SignupPage />} />

      <Route path="/properties" element={<PropertiesPage />} />

      <Route path="/properties/:id" element={<PropertyDetailsPage />} />

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

      {/* NEW ROUTE: Secure listing builder dashboard view */}
      <Route
        path="/add-property"
        element={
          <ProtectedRoute>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />

      <Route path="/about" element={<AboutUs />} />

      <Route path="/review" element={<Testimonials />} />

      {/* UPDATED: Connected your real dynamic user properties dashboard component view */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
