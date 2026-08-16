const express = require("express");
const router = express.Router();
const {createRoute,getRouteByID,updateRoute,deleteRoute} = require("../controllers/routeController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/",authMiddleware,authorizeRoles("admin"),createRoute);

router.get("/:routeID",authMiddleware,authorizeRoles("admin", "driver", "parent"),getRouteByID);

router.put("/:routeID",authMiddleware,authorizeRoles("admin"),updateRoute);

router.delete("/:routeID",authMiddleware,authorizeRoles("admin"),deleteRoute);

module.exports = router;