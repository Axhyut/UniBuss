const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create a new booking
router.post("/create", bookingController.createBooking);

// Get booking details by PNR
router.get("/pnr/:pnr", bookingController.getBookingDetails);

// Fix: Changed from '/user/userId' to '/user/:userId'
router.get("/user/:userId", bookingController.getUserBookings);

router.post("/rate", bookingController.rateDriver);

module.exports = router;
