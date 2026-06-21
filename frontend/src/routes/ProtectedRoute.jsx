import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { user, loading, token } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const resolvedRole = String(user?.role || "user")
    .toLowerCase()
    .trim();

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).toLowerCase().trim()
  );

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(resolvedRole)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
