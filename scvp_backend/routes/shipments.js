// routes/shipments.js
const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const { protect, authorize } = require("../middleware/auth");

// @desc    Get all shipments for the authenticated organization
// @route   GET /api/shipments
// @access  Private (logistics_manager, admin)
router.get(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.getAllShipments
);

// @desc    Get a single shipment by ID for the authenticated organization
// @route   GET /api/shipments/:id
// @access  Private (logistics_manager, admin)
router.get(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.getShipmentById
);

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private (logistics_manager, admin)
router.post(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.createShipment
);

// @desc    Update a shipment by ID
// @route   PUT /api/shipments/:id
// @access  Private (logistics_manager, admin)
router.put(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.updateShipment
);

// @desc    Delete a shipment by ID
// @route   DELETE /api/shipments/:id
// @access  Private (admin) - Only admin should delete shipments
router.delete(
  "/:id", 
  protect, 
  authorize("admin"), 
  shipmentController.deleteShipment
);

// @desc    Get events for a specific shipment
// @route   GET /api/shipments/:id/events
// @access  Private (logistics_manager, admin)
router.get(
  "/:id/events",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.getShipmentEvents
);

// @desc    Log a new shipment event (e.g., automated update)
// @route   POST /api/shipments/:id/events
// @access  Private (logistics_manager, admin) - Could be internal/system for automated updates
router.post(
  "/:id/events",
  protect,
  authorize("logistics_manager", "admin"),
  shipmentController.createShipmentEvent
);

module.exports = router;