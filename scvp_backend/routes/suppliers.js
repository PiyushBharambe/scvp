// routes/suppliers.js
const express = require("express");
const router = express.Router();
const Supplier = require("../db/models/Supplier"); // Adjust path as needed
const { protect, authorize } = require("../middleware/auth");
const logger = require("../utils/logger"); // Adjust path as needed

// @desc    Get all suppliers for the authenticated organization
// @route   GET /api/suppliers
// @access  Private (logistics_manager, admin)
router.get(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    try {
      const suppliers = await Supplier.query()
        .where("organization_id", req.user.organization_id)
        .orderBy("name"); // Order by name for easy viewing
      res.status(200).json(suppliers);
    } catch (error) {
      logger.error("Error fetching suppliers:", error);
      res.status(500).json({
        message: "Server error fetching suppliers",
        error: error.message,
      });
    }
  }
);

// @desc    Get a single supplier by ID for the authenticated organization
// @route   GET /api/suppliers/:id
// @access  Private (logistics_manager, admin)
router.get(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    try {
      const supplier = await Supplier.query()
        .where("id", req.params.id)
        .andWhere("organization_id", req.user.organization_id)
        .first();

      if (!supplier) {
        return res
          .status(404)
          .json({ message: "Supplier not found or you do not have access" });
      }
      res.status(200).json(supplier);
    } catch (error) {
      logger.error("Error fetching single supplier:", error);
      res.status(500).json({
        message: "Server error fetching supplier",
        error: error.message,
      });
    }
  }
);

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private (logistics_manager, admin)
router.post(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    const { name, contact_person, contact_email, phone_number, address } =
      req.body;

    if (!name) {
      return res.status(400).json({ message: "Supplier name is required" });
    }

    try {
      const newSupplier = await Supplier.query().insert({
        organization_id: req.user.organization_id,
        name,
        contact_person,
        contact_email,
        phone_number,
        address,
      });
      res.status(201).json(newSupplier);
    } catch (error) {
      logger.error("Error creating supplier:", error);
      res.status(500).json({
        message: "Server error creating supplier",
        error: error.message,
      });
    }
  }
);

// @desc    Update a supplier by ID
// @route   PUT /api/suppliers/:id
// @access  Private (logistics_manager, admin)
router.put(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    const { name, contact_person, contact_email, phone_number, address } =
      req.body;

    try {
      const updatedSupplier = await Supplier.query()
        .patchAndFetchById(req.params.id, {
          name,
          contact_person,
          contact_email,
          phone_number,
          address,
          updated_at: new Date().toISOString(), // Manually update updated_at
        })
        .where("organization_id", req.user.organization_id); // Ensure user owns the supplier

      if (!updatedSupplier) {
        return res
          .status(404)
          .json({ message: "Supplier not found or you do not have access" });
      }
      res.status(200).json(updatedSupplier);
    } catch (error) {
      logger.error("Error updating supplier:", error);
      res.status(500).json({
        message: "Server error updating supplier",
        error: error.message,
      });
    }
  }
);

// @desc    Delete a supplier by ID
// @route   DELETE /api/suppliers/:id
// @access  Private (admin) - Only admin should delete suppliers
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const deletedCount = await Supplier.query()
      .delete()
      .where("id", req.params.id)
      .andWhere("organization_id", req.user.organization_id); // Ensure user owns the supplier

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Supplier not found or you do not have access" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    logger.error("Error deleting supplier:", error);
    res.status(500).json({
      message: "Server error deleting supplier",
      error: error.message,
    });
  }
});

module.exports = router;
