const { Driver, User, Admin } = require("../models"); // Import models

// Function to handle user signup
const signup = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    userType,
    gender,
    licenseNumber,
    vehicleNumber,
    vehicleType,
    isAvailable,
    licenseValidity,
  } = req.body;

  try {
    // Check user type and create accordingly
    if (userType === "driver") {
      const newBus = await Driver.create({
        email,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        licenseNumber,
        vehicleNumber,
        vehicleType,
        gender,
        isAvailable,
        status: "inactive",
        licenseValidity,
        rating: 5.0,
      });
      return res
        .status(201)
        .json({ message: "Driver registered successfully", driver: newBus });
    } else if (userType === "user") {
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        gender,
        status: "active",
      });
      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during registration" });
  }
};

const checkUserExistence = async (req, res) => {
  const { email } = req.params;
  console.log("Checking existence for email:", email);

  try {
    // Check in us collection
    const driver = await Driver.findOne({ where: { email } });
    if (driver) {
      return res.json({
        exists: true,
        userType: "driver",
        userName: driver.firstName + " " + driver.lastName,
        driverId: driver.id,
        status: driver.status,
      });
    }

    // Check in User collection
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.json({
        exists: true,
        userType: "user",
        userName: user.firstName + " " + user.lastName,
        userId: user.id,
      });
    }

    // If user not found in either collection
    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while checking user existence" });
  }
};

// Login endpoint
const login = async (req, res) => {
  const { admin_name, password } = req.body;

  try {
    // Find admin by admin_name
    const admin = await Admin.findOne({
      where: { admin_name },
    });

    if (!admin || password !== admin.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      admin: {
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
};

// Add these new functions
const getProfile = async (req, res) => {
  const { email } = req.params;

  try {
    const driver = await Driver.findOne({ where: { email } });
    if (driver) {
      return res.json({
        userType: "driver",
        ...driver.dataValues,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.json({
        userType: "user",
        ...user.dataValues,
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  const { email } = req.params;
  const updates = req.body;

  try {
    // Check if user is driver
    const driver = await Driver.findOne({ where: { email } });
    if (driver) {
      await Driver.update(updates, { where: { email } });
      const updatedDriver = await Driver.findOne({ where: { email } });
      return res.json({
        message: "Driver profile updated",
        ...updatedDriver.dataValues,
      });
    }

    // Check if user is user
    const user = await User.findOne({ where: { email } });
    if (user) {
      await User.update(updates, { where: { email } });
      const updatedUser = await User.findOne({ where: { email } });
      return res.json({
        message: "User profile updated",
        ...updatedUser.dataValues,
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

// Update exports
module.exports = {
  signup,
  checkUserExistence,
  login,
  getProfile,
  updateProfile,
};
