import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";

export default function App() {
  return (
    <Routes>
      {/* Route for the Login Page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Route for the Signup Page */}
      <Route path="/signup" element={<SignupPage />} />

      {/* Redirect empty paths (like home page) to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
