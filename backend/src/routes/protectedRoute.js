import React from "react";
import { Navigate } from "react-router-dom";

export default function SuperAdminGuard({ children }) {
  const token = localStorage.getItem("token");
  
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  // 🟢 STRICT OWNER VERIFICATION: Must be flagged as SUPER_ADMIN or match your master email exactly
  const isSuperAdmin = 
    user.role === "SUPER_ADMIN" || 
    user.email === "eyasoumelesa.emz@gmail.com";

  if (!token || !isSuperAdmin) {
    // If unauthorized, throw them back out to prevent structural security breaches
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
