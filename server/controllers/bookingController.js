// controllers/bookingController.js
const { PNR, Schedule, Driver, User } = require("../models");
const { v4: uuidv4 } = require("uuid");
const {
  sendEmail,
  generateUserEmail,
  generateBusEmail,
} = require("../utils/emailService");
const { sequelize } = require("../models");
const logger = require("../utils/logger"); // Assumed logger utility

const createBooking = async (req, res) => {
  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    const {
      scheduleId,
      userId,
      driverId,
      locationFrom,
      locationTo,
      date,
      time,
      distance,
      price,
    } = req.body;

    // Validate required fields with more comprehensive checks
    const requiredFields = [
      "scheduleId",
      "userId",
      "driverId",
      "locationFrom",
      "locationTo",
      "date",
      "time",
      "distance",
      "price",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !req.body[field] ||
        (typeof req.body[field] === "string" && req.body[field].trim() === "")
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or empty required fields: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Create PNR record
    const pnr = await PNR.create(
      {
        PNRid: uuidv4(),
        scheduleId,
        userId,
        driverId,
        locationFrom,
        locationTo,
        date,
        time,
        distance: parseFloat(distance),
        price: parseFloat(price),
        status: "active",
      },
      { transaction }
    );

    // Update schedule status
    await Schedule.update(
      { status: "drivery" },
      {
        where: {
          id: scheduleId,
          status: "reserved",
        },
        transaction,
      }
    );

    //wallet logic for user
    await User.update(
      { wallet: sequelize.literal(`wallet - ${price}`) },
      {
        where: {
          id: userId,
        },
        transaction,
      }
    );

    // Fetch driver and user details
    const [driver, user] = await Promise.all([
      Driver.findByPk(driverId),
      User.findByPk(userId),
    ]);

    // Validate driver and user
    if (!driver || !user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Driver or User not found",
      });
    }

    // Commit transaction before sending emails
    await transaction.commit();

    // Async email sending with better error handling
    try {
      const [userEmailSent, driverEmailSent] = await Promise.allSettled([
        sendEmail(user.email, generateUserEmail(pnr, driver)),
        sendEmail(driver.email, generateBusEmail(pnr, user)),
      ]);

      // Log email sending results
      logger.info("Email Sending Results", {
        user: userEmailSent.status,
        driver: driverEmailSent.status,
      });

      // Optional: You could implement a notification system
      // for failed email sends if needed
    } catch (emailError) {
      logger.error("Email Sending Error", {
        error: emailError,
        pnrId: pnr.PNRid,
      });
      // Non-blocking email error
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      pnr: pnr.PNRid,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();

    logger.error("Booking Creation Error", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error while creating booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await PNR.findOne({
      where: { PNRid: pnr },
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: [
            "firstName",
            "lastName",
            "vehicleNumber",
            "vehicleType",
            "phoneNumber",
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName", "phoneNumber"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const formattedData = {
      success: true,
      booking: {
        pnr: booking.PNRid,
        locationFrom: booking.locationFrom,
        locationTo: booking.locationTo,
        date: booking.date,
        time: booking.time,
        distance: booking.distance,
        price: booking.price,
        status: booking.status,
        driver: booking.driver
          ? {
              name: `${booking.driver.firstName} ${booking.driver.lastName}`,
              vehicleNumber: booking.driver.vehicleNumber,
              vehicleType: booking.driver.vehicleType,
              phoneNumber: booking.driver.phoneNumber,
            }
          : null,
        user: booking.user
          ? {
              name: `${booking.user.firstName} ${booking.user.lastName}`,
              phoneNumber: booking.user.phoneNumber,
            }
          : null,
      },
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching booking details",
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const bookings = await PNR.findAll({
      where: { userId },
      include: [
        {
          model: Driver,
          as: "driver",
          attributes: [
            "firstName",
            "lastName",
            "vehicleNumber",
            "vehicleType",
            "phoneNumber",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedBookings = bookings.map((booking) => ({
      pnr: booking.PNRid,
      locationFrom: booking.locationFrom,
      locationTo: booking.locationTo,
      date: booking.date,
      time: booking.time,
      distance: booking.distance,
      price: booking.price,
      status: booking.status,
      driver: booking.driver
        ? {
            name: `${booking.driver.firstName} ${booking.driver.lastName}`,
            vehicleNumber: booking.driver.vehicleNumber,
            vehicleType: booking.driver.vehicleType,
            phoneNumber: booking.driver.phoneNumber,
          }
        : null,
    }));

    res.status(200).json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching bookings",
    });
  }
};

const rateDriver = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vehicleNumber,
      pnr,
      driverBehavior,
      drivingSkill,
      vehicleCleanliness,
      punctuality,
      overallSatisfaction,
    } = req.body;

    // Validate inputs
    const requiredFields = [
      "vehicleNumber",
      "pnr",
      "driverBehavior",
      "drivingSkill",
      "vehicleCleanliness",
      "punctuality",
      "overallSatisfaction",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !req.body[field] ||
        (typeof req.body[field] === "number" &&
          (req.body[field] < 1 || req.body[field] > 5))
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing fields: ${missingFields.join(", ")}`,
      });
    }

    // Find the driver by vehicle number
    const driver = await Driver.findOne({
      where: { vehicleNumber },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Find the PNR to ensure it's a completed booking for this driver
    const booking = await PNR.findOne({
      where: {
        PNRid: pnr,
        driverId: driver.id, // Use driver ID from found driver
        status: "completed",
      },
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking for rating",
      });
    }

    // Calculate average rating
    const averageRating =
      (driverBehavior +
        drivingSkill +
        vehicleCleanliness +
        punctuality +
        overallSatisfaction) /
      5;

    // Update driver's rating
    // New rating is weighted average of existing and new rating
    const currentRating = driver.rating || 0;
    const totalRatings = driver.totalRatings || 0;

    const newTotalRatings = totalRatings + 1;
    const newOverallRating =
      (currentRating * totalRatings + averageRating) / newTotalRatings;

    await Driver.update(
      {
        rating: parseFloat(newOverallRating.toFixed(2)),
        totalRatings: newTotalRatings,
      },
      {
        where: { id: driver.id },
        transaction,
      }
    );

    // Mark booking as rated
    await PNR.update(
      { isRated: true },
      {
        where: { PNRid: pnr },
        transaction,
      }
    );

    // Commit transaction
    await transaction.commit();

    // Log rating
    logger.info("Driver Rated", {
      vehicleNumber,
      pnr,
      averageRating,
      newOverallRating,
    });

    res.status(200).json({
      success: true,
      message: "Driver rated successfully",
      newRating: newOverallRating,
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();

    logger.error("Driver Rating Error", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Error processing driver rating",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createBooking,
  getBookingDetails,
  getUserBookings,
  rateDriver,
};
