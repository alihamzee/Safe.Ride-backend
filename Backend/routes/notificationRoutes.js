const express = require("express");
const router = express.Router();
const {getMyNotifications,markAsRead} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/",authMiddleware,getMyNotifications);

router.patch("/:id/read",authMiddleware,markAsRead);

module.exports = router;