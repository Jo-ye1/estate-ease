import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If user is not logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the protected component (e.g., Dashboard)
  return children;
}
