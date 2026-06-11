import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Changed to a named export to match your router files perfectly
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};


// @desc    Enforce strict Admin security verification privileges
export const admin = (req, res, next) => {
  // 🛡️ Fail-safe double validation check ensures nested role properties parse cleanly
  const userRole = req.user?.role || (req.user?.user && req.user.user.role);
  
  if (userRole && String(userRole).toLowerCase().trim() === "admin") {
    next();
  } else {
    console.warn(`🚨 Admin Access Blocked. Detected account role payload: ${userRole}`);
    res.status(403).json({ message: "Access Denied: Administrative security Clearance required." });
  }
};
