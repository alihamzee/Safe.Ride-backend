const Route = require("../models/Route");
const createRoute = async (req, res) => {
    try {
        const {routeID,name,bus,school,direction,stops} = req.body;
        if (!routeID ||!name ||!bus ||!school ||!direction) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingRoute = await Route.findOne({
            routeID
        });
        if (existingRoute) {
            return res.status(400).json({
                success: false,
                message: "Route ID already exists."
            });
        }
        const route = await Route.create({routeID,name,bus,school,direction,stops});
        const result = await Route.findById(route._id)
            .populate("bus")
            .populate("school");
        res.status(201).json({
            success: true,
            message: "Route created successfully!",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getRouteByID = async (req, res) => {
    try {
        const route = await Route.findOne({
            routeID: req.params.routeID
        })
            .populate("bus")
            .populate("school");
        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found."
            });
        }
        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateRoute = async (req, res) => {
    try {
        const updates = {};
        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }

        if (req.body.bus !== undefined) {
            updates.bus = req.body.bus;
        }

        if (req.body.school !== undefined) {
            updates.school = req.body.school;
        }

        if (req.body.direction !== undefined) {
            updates.direction = req.body.direction;
        }

        if (req.body.stops !== undefined) {
            updates.stops = req.body.stops;
        }
        const route = await Route.findOneAndUpdate(
            {
                routeID: req.params.routeID
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("bus")
            .populate("school");

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Route updated successfully!",
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findOneAndDelete({
            routeID: req.params.routeID
        });
        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Route deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createRoute,getRouteByID,updateRoute,deleteRoute};