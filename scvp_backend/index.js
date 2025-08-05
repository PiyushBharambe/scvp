// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("./config/database");
const logger = require("./utils/logger");
const gpsSimulationService = require("./services/gpsSimulationService");

logger.info("DATABASE_URL configured", { url: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@') });

// Import routes
const authRoutes = require("./routes/auth");
const shipmentRoutes = require("./routes/shipments");
const supplierRoutes = require("./routes/suppliers");
const customerRoutes = require("./routes/customers");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    logger.error('Bad JSON error', { message: error.message });
    return res.status(400).json({ message: 'Invalid JSON format' });
  }
  next();
});

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("Supply Chain Visibility Platform Backend API is running!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);


// Database connection test
app.get("/api/db-test", async (req, res) => {
  try {
    await knex.raw("SELECT 1+1 AS result");
    res.status(200).json({ message: "Database connection successful!" });
  } catch (error) {
    logger.error("Database connection error", { error: error.message });
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access at http://localhost:${PORT}`);
  
  // Start automatic GPS simulation
  gpsSimulationService.start();
});

module.exports = app;