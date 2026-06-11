import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const { user } = useAuth();

  // 1. If no token exists at all, redirect to login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    // 🛡️ Bulletproof Role Extraction Engine
    let currentUserRole = "user";

    // Layer 1: Check active memory context state layer
    if (user && user.role) {
      currentUserRole = user.role;
    } else {
      // Layer 2: Fallback safely straight to localStorage memory items
      try {
        const localUserString = localStorage.getItem("user");
        if (localUserString) {
          const parsed = JSON.parse(localUserString);
          currentUserRole = parsed.role || parsed.user?.role || "user";
        }
      } catch (e) {
        console.error("Failed to parse user role in fallback engine:", e);
      }
    }

    // 👑 HARDCODED SUPER POWER BACKUP privilege layer bypass:
    // If the logged-in email is your specific master account, force it to 'admin'
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr && storedUserStr.includes("1234567890@gmail.com")) {
      currentUserRole = "admin";
    }

    const finalRole = String(currentUserRole).toLowerCase().trim();
    
    // Check if the verified role satisfies the route access array criteria
    const hasPermission = allowedRoles.map(r => r.toLowerCase()).includes(finalRole);

    if (!hasPermission) {
      // 🛡️ FIXED: Removed the blocking 'alert()' popup here so your screen never freezes again
      console.warn(`Access Denied for role: ${finalRole}`);
      return <Navigate to="/" replace />; // Smoothly redirects unpermitted users to the home landing page instead of crashing
    }
  }

  return children;
}
