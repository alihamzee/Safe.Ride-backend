const express = require("express");
const router = express.Router();
const {createTrip,getTripByID,updateTrip,updateTripLocation,completeTrip,getMyChildTrip,getMyTrip,deleteTrip,startTrip,} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createTrip);

router.get("/my-child-trip",authMiddleware,authorizeRoles("parent"),getMyChildTrip);

router.get("/my-trip",authMiddleware,authorizeRoles("driver"),getMyTrip);

router.get("/:tripID",authMiddleware,getTripByID);

router.put("/:tripID",authMiddleware,authorizeRoles("admin"),updateTrip);

router.patch("/:tripID/location",authMiddleware,authorizeRoles("driver"),updateTripLocation);

router.patch("/:tripID/complete",authMiddleware,authorizeRoles("driver"),completeTrip);

router.delete("/:tripID",authMiddleware,authorizeRoles("admin"),deleteTrip);

router.patch("/:tripID/start",authMiddleware,authorizeRoles("driver"),startTrip);

module.exports = router;