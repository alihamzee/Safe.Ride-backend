const express = require("express");
const router = express.Router();
const {createSchool,getSchoolByID,updateSchool,deleteSchool} = require("../controllers/schoolController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createSchool);

router.get("/:schoolID",authMiddleware,authorizeRoles("admin", "parent", "driver"),getSchoolByID);

router.put("/:schoolID",authMiddleware,authorizeRoles("admin"),updateSchool);

router.delete("/:schoolID",authMiddleware,authorizeRoles("admin"),deleteSchool);

module.exports = router;