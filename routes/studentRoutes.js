const express = require("express");
const router = express.Router();
const {createStudent,getStudentByID,updateStudent,getMyChildren,deleteStudent} = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createStudent);

router.get("/my-children",authMiddleware,authorizeRoles("parent"),getMyChildren);

router.get("/:studentID",authMiddleware,authorizeRoles("parent", "admin"),getStudentByID);

router.put("/:studentID",authMiddleware,authorizeRoles("admin"),updateStudent);

router.delete("/:studentID",authMiddleware,authorizeRoles("admin"),deleteStudent);

module.exports = router;
