import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "super_admin")) {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admin authorization required."
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: Missing authentication profile." });
    }

    const currentRole = String(req.user.role).toLowerCase().trim();
    const normalizedRoles = allowedRoles.map((r) => String(r).toLowerCase().trim());

    if (!normalizedRoles.includes(currentRole)) {
      return res.status(403).json({
        message: `Forbidden: Access denied for your user role tier.`
      });
    }

    next();
  };
};
