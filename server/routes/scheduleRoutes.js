const express = require("express");
const router = express.Router();
const {
  addSchedule,
  getBusSchedules,
  cancelSchedule,
  checkAvailableVehicles,
  sendOtp,
  verifyOtp,
  getPnrBySchedule,
  reserve,
} = require("../controllers/scheduleController");

router.post("/schedules", addSchedule);
router.get("/schedules/bus/:busId", getBusSchedules);
router.put("/schedules/:scheduleId/cancel", cancelSchedule);
router.post("/booking/check-availability", checkAvailableVehicles);
router.post("/schedules/:scheduleId/send-otp", sendOtp);
router.post("/schedules/:scheduleId/verify-otp", verifyOtp);
router.get("/pnr/schedule/:scheduleId", getPnrBySchedule);
router.post("/schedules/reserve", reserve);
module.exports = router;
