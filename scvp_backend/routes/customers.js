// routes/customers.js
const express = require("express");
const router = express.Router();
const Customer = require("../db/models/Customer"); // Adjust path as needed
const { protect, authorize } = require("../middleware/auth"); // Adjust path as needed
const logger = require("../utils/logger");

// @desc    Get all customers for the authenticated organization
// @route   GET /api/customers
// @access  Private (logistics_manager, admin)
router.get(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    try {
      const customers = await Customer.query()
        .where("organization_id", req.user.organization_id)
        .orderBy("name"); // Order by name for easy viewing
      res.status(200).json(customers);
    } catch (error) {
      logger.error("Error fetching customers", { error: error.message });
      res.status(500).json({
        message: "Server error fetching customers",
        error: error.message,
      });
    }
  }
);

// @desc    Get a single customer by ID for the authenticated organization
// @route   GET /api/customers/:id
// @access  Private (logistics_manager, admin)
router.get(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    try {
      const customer = await Customer.query()
        .where("id", req.params.id)
        .andWhere("organization_id", req.user.organization_id)
        .first();

      if (!customer) {
        return res
          .status(404)
          .json({ message: "Customer not found or you do not have access" });
      }
      res.status(200).json(customer);
    } catch (error) {
      logger.error("Error fetching single customer", { error: error.message });
      res.status(500).json({
        message: "Server error fetching customer",
        error: error.message,
      });
    }
  }
);

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private (logistics_manager, admin)
router.post(
  "/",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    const { name, contact_person, contact_email, phone_number, address } =
      req.body;

    if (!name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    try {
      const newCustomer = await Customer.query().insert({
        organization_id: req.user.organization_id,
        name,
        contact_person,
        contact_email,
        phone_number,
        address,
      });
      res.status(201).json(newCustomer);
    } catch (error) {
      logger.error("Error creating customer", { error: error.message });
      res.status(500).json({
        message: "Server error creating customer",
        error: error.message,
      });
    }
  }
);

// @desc    Update a customer by ID
// @route   PUT /api/customers/:id
// @access  Private (logistics_manager, admin)
router.put(
  "/:id",
  protect,
  authorize("logistics_manager", "admin"),
  async (req, res) => {
    const { name, contact_person, contact_email, phone_number, address } =
      req.body;

    try {
      const updatedCustomer = await Customer.query()
        .patchAndFetchById(req.params.id, {
          name,
          contact_person,
          contact_email,
          phone_number,
          address,
          updated_at: new Date().toISOString(), // Manually update updated_at
        })
        .where("organization_id", req.user.organization_id); // Ensure user owns the customer

      if (!updatedCustomer) {
        return res
          .status(404)
          .json({ message: "Customer not found or you do not have access" });
      }
      res.status(200).json(updatedCustomer);
    } catch (error) {
      logger.error("Error updating customer", { error: error.message });
      res.status(500).json({
        message: "Server error updating customer",
        error: error.message,
      });
    }
  }
);

// @desc    Delete a customer by ID
// @route   DELETE /api/customers/:id
// @access  Private (admin) - Only admin should delete customers
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const deletedCount = await Customer.query()
      .delete()
      .where("id", req.params.id)
      .andWhere("organization_id", req.user.organization_id); // Ensure user owns the customer

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Customer not found or you do not have access" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    logger.error("Error deleting customer", { error: error.message });
    res.status(500).json({
      message: "Server error deleting customer",
      error: error.message,
    });
  }
});

module.exports = router;
