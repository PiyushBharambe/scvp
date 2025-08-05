// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// @desc    Register a new user and organization
// @route   POST /api/auth/register
// @access  Public
router.post("/register", authController.register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", authController.login);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, authController.getMe);

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Public
router.get("/verify", authController.verifyToken);

module.exports = router;