const express = require("express");
const router = express.Router();
const { Driver, User } = require("../models");
const { Op } = require("sequelize");
const {
  sendEmail,
  generateVerificationEmail,
} = require("../utils/emailService");

// Get all drivers
router.get("/api/drivers", async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "dateOfBirth",
        "email",
        "phoneNumber",
        "vehicleNumber",
        "vehicleType",
        "status",
        "gender",
        "licenseNumber",
        "rating",
        "isAvailable",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// Get all users
router.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "gender",
        "status",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Verify driver (update status)
router.patch("/api/drivers/:id/verify", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // First update the driver status
    await driver.update({ status });

    // Then send email notification
    try {
      const [emailResult] = await Promise.allSettled([
        sendEmail(driver.email, generateVerificationEmail(driver)),
      ]);

      // Log email results using console instead of undefined logger
      console.log("Email Sending Results:", {
        driver: emailResult.status,
      });
    } catch (emailError) {
      // Handle email errors without blocking the response
      console.error("Email Sending Error:", emailError);
    }

    // Send single response after all operations
    res.json({
      message: "Driver status updated successfully",
      driver: {
        id: driver.id,
        status: driver.status,
      },
    });
  } catch (error) {
    // Handle main errors
    console.error("Error updating driver status:", error);
    res.status(500).json({
      error: "Failed to update driver status",
      details: error.message,
    });
  }
});

// Get dashboard statistics
router.get("/api/admin/dashboard/stats", async (req, res) => {
  try {
    const totalDrivers = await Driver.count();
    const activeDrivers = await Driver.count({
      where: { status: "active" },
    });
    const pendingDrivers = await Driver.count({
      where: { status: "inactive" },
    });
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: { status: "active" },
    });

    // Get new registrations in the last 7 days
    const lastWeek = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
    const newDrivers = await Driver.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek,
        },
      },
    });
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek,
        },
      },
    });

    res.json({
      drivers: {
        total: totalDrivers,
        active: activeDrivers,
        pending: pendingDrivers,
        newLastWeek: newDrivers,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        newLastWeek: newUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// Search drivers
router.get("/api/drivers/search", async (req, res) => {
  const { query } = req.query;

  try {
    const drivers = await Driver.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { vehicleNumber: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.json(drivers);
  } catch (error) {
    console.error("Error searching drivers:", error);
    res.status(500).json({ error: "Failed to search drivers" });
  }
});

// Search users
router.get("/api/users/search", async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Get driver details by ID
router.get("/api/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    console.error("Error fetching driver details:", error);
    res.status(500).json({ error: "Failed to fetch driver details" });
  }
});

// Get user details by ID
router.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

module.exports = router;
