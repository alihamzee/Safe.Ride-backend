const Bus = require("../models/Bus");
const Student = require("../models/Student");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const createBus = async (req, res) => {
    try {
        const {busID,busNumber,capacity} = req.body;
        if (!busID || !busNumber || !capacity) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingBus = await Bus.findOne({
            busID
        });
        if (existingBus) {
            return res.status(400).json({
                success: false,
                message: "Bus ID already exists."
            });
        }
        const bus = await Bus.create({busID,busNumber,capacity});
        res.status(201).json({
            success: true,
            message: "Bus created successfully!",
            data: bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 
const getBusByID = async (req, res) => {
    try {
        const bus = await Bus.findOne({
            busID: req.params.busID
        });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found."
            });
        }
        res.status(200).json({
            success: true,
            data: bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateBus = async (req, res) => {
    try {
        const updates = {};
        if (req.body.busNumber !== undefined) {
            updates.busNumber = req.body.busNumber;
        }
        if (req.body.capacity !== undefined) {
            updates.capacity = req.body.capacity;
        }
        const bus = await Bus.findOneAndUpdate(
            {
                busID: req.params.busID
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Bus updated successfully!",
            data: bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findOne({
            busID: req.params.busID
        });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found."
            });
        }
        const studentUsingBus = await Student.findOne({
            bus: bus._id
        });
        if (studentUsingBus) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this bus because a student is assigned to it."
            });
        }
        const driverUsingBus = await Driver.findOne({
            bus: bus._id
        });
        if (driverUsingBus) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this bus because a driver is assigned to it."
            });
        }
        const tripUsingBus = await Trip.findOne({
            bus: bus._id
        });
        if (tripUsingBus) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this bus because it is used by a trip."
            });
        }
        await Bus.findByIdAndDelete(bus._id);
        res.status(200).json({
            success: true,
            message: "Bus deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {createBus,getBusByID,updateBus,deleteBus};
