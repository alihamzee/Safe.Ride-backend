const express = require("express");
const router = express.Router();
const {createBus,getBusByID,updateBus,deleteBus} = require("../controllers/busController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createBus);

router.get("/:busID",authMiddleware,authorizeRoles("admin", "parent", "driver"),getBusByID);

router.put("/:busID",authMiddleware,authorizeRoles("admin"),updateBus);

router.delete("/:busID",authMiddleware,authorizeRoles("admin"),deleteBus);

module.exports = router;