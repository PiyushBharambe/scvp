// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../db/models/User"); // Adjust path as needed

// Middleware to protect routes: verifies JWT and attaches user to req
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers (Authorization: Bearer TOKEN)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token using the JWT_SECRET from .env
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
      const decoded = jwt.verify(token, secret);

      // Attach user to the request object (excluding password hash)
      // We select specific fields to avoid sending sensitive data
      req.user = await User.query()
        .findById(decoded.id)
        .select("id", "email", "role", "organization_id");

      // If user is not found for the decoded ID, it's an invalid token
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Token verification error:", error);
      // If token is invalid (e.g., expired, malformed), send 401
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is provided in the header
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to authorize users based on their role
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists on req (from 'protect' middleware) and if their role is in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${
          req.user ? req.user.role : "none"
        } is not authorized to access this route`,
      });
    }
    next(); // User is authorized, proceed
  };
};

module.exports = { protect, authorize }; // Export both middlewares
