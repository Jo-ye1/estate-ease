import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const requireCapability = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: Active authentication profile required." });
    }

    const userRole = String(req.user.role).toLowerCase().trim();
    const activeAllowedCapabilities = ROLE_PERMISSIONS[userRole] || [];

    if (!activeAllowedCapabilities.includes(requiredPermission)) {
      return res.status(403).json({
        message: `Forbidden: Critical capability error. Your profile tier locks the verified token signature '${requiredPermission}' parameter.`
      });
    }

    next();
  };
};
