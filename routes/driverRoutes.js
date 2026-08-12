const express = require("express");
const router = express.Router();
const {createDriver,getMyDriverProfile,getDriverByID,updateDriver,deleteDriver} = require("../controllers/driverController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createDriver);

router.get("/me",authMiddleware,authorizeRoles("driver"),getMyDriverProfile);

router.get("/:driverID",authMiddleware,authorizeRoles("admin"),getDriverByID);

router.put("/:driverID",authMiddleware,authorizeRoles("admin"),updateDriver);

router.delete("/:driverID",authMiddleware,authorizeRoles("admin"),deleteDriver);

module.exports = router;
