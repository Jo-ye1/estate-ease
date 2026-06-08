import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route for the Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route for the Signup Page */}
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Route for the Dashboard Page */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Automatically redirect any unknown paths or the root URL to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
