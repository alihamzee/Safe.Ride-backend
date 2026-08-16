const express = require("express");
const router = express.Router();
const {getDashboard,getAllStudents,getAllDrivers,getAllBuses,getAllSchools,getAllTrips,getAllUsers,createUser,updateUser,deleteUser,updateUserStatus} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/dashboard",authMiddleware,authorizeRoles("admin"),getDashboard);

router.get("/students",authMiddleware,authorizeRoles("admin"),getAllStudents);

router.get("/drivers",authMiddleware,authorizeRoles("admin"),getAllDrivers);

router.get("/buses",authMiddleware,authorizeRoles("admin"),getAllBuses);

router.get("/schools",authMiddleware,authorizeRoles("admin"),getAllSchools);

router.get("/trips",authMiddleware,authorizeRoles("admin"),getAllTrips);

router.get("/users",authMiddleware,authorizeRoles("admin"),getAllUsers);

router.post("/users",authMiddleware,authorizeRoles("admin"),createUser);

router.put("/users/:userID",authMiddleware,authorizeRoles("admin"),updateUser);

router.delete("/users/:userID",authMiddleware,authorizeRoles("admin"),deleteUser);

router.patch("/users/:userID/status",authMiddleware,authorizeRoles("admin"),updateUserStatus);

module.exports = router;
