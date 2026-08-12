const express = require("express");
const router = express.Router();
const {markPickedUp,markDroppedOff,getTripAttendance,getMyChildAttendance} = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/my-child/:studentID",authMiddleware,authorizeRoles("parent"), getMyChildAttendance);

router.patch("/:tripID/:studentID/pickup",authMiddleware,authorizeRoles("driver"),markPickedUp);

router.patch("/:tripID/:studentID/dropoff",authMiddleware,authorizeRoles("driver"),markDroppedOff);

router.get("/:tripID",authMiddleware,authorizeRoles("admin", "driver"),getTripAttendance);

module.exports = router;
