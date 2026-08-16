const Trip = require("../models/Trip");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const Attendance = require("../models/Attendance");
const notifyParents = async (busID, title, message, type) => {
    const students = await Student.find({
        bus: busID
    });
    const parentIDs = students.map((student) =>
        student.parent.toString()
    );
    const uniqueParentIDs = [...new Set(parentIDs)];
    for (const parentID of uniqueParentIDs) {
        await Notification.create({
            user: parentID,
            title,
            message,
            type
        });
    }
};
const createTrip = async (req, res) => {
    try {
        const {tripID,bus,driver,route,status,currentLocation,startedAt} = req.body;
        if (!tripID || !bus || !driver) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingTrip = await Trip.findOne({ tripID });
        if (existingTrip) {
            return res.status(400).json({
                success: false,
                message: "Trip ID already exists."
            });
        }
        const trip = await Trip.create({tripID,bus,driver,route,status,currentLocation,startedAt
        });
        res.status(201).json({
            success: true,
            message: "Trip created successfully!",
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getTripByID = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        })
            .populate("bus")
            .populate("driver", "userID email role phone");
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        res.status(200).json({
            success: true,
            data: trip
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (req.body.bus !== undefined) {
            trip.bus = req.body.bus;
        }

        if (req.body.driver !== undefined) {
            trip.driver = req.body.driver;
        }

        if (req.body.route !== undefined) {
            trip.route = req.body.route;
        }

        if (req.body.status !== undefined) {
            trip.status = req.body.status;
        }

        if (req.body.currentLocation !== undefined) {
            trip.currentLocation = req.body.currentLocation;
        }

        if (req.body.startedAt !== undefined) {
            trip.startedAt = req.body.startedAt;
        }

        await trip.save();

        const result = await Trip.findById(trip._id)
            .populate("bus")
            .populate(
                "driver",
                "userID email role phone"
            )
            .populate({
                path: "route",
                populate: [
                    {
                        path: "bus"
                    },
                    {
                        path: "school"
                    }
                ]
            });

        res.status(200).json({
            success: true,
            message: "Trip updated successfully!",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateTripLocation = async (req, res) => {
    try {
        const {latitude,longitude} = req.body;
        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide latitude and longitude."
            });
        }
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned driver can update this trip."
            });
        }
        if (trip.status !== "in-progress") {
            return res.status(400).json({
                success: false,
                message: "Trip must be started before updating location."
            });
        }

        trip.currentLocation = {latitude,longitude};
        await trip.save();
        res.status(200).json({
            success: true,
            message: "Bus location updated successfully!",
            data: trip
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const completeTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned driver can complete this trip."
            });
        }

        if (trip.status === "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Trip must be started before it can be completed."
            });
        }

        if (trip.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Trip is already completed."
            });
        }


        trip.status = "completed";

        await trip.save();


        await notifyParents(
            trip.bus,
            "Trip Completed",
            "Your child's bus trip has been completed.",
            "trip-completed"
        );

        const result = await Trip.findById(trip._id)
            .populate("bus")
            .populate(
                "driver",
                "userID email role phone"
            )
            .populate({
                path: "route",
                populate: [
                    {
                        path: "bus"
                    },
                    {
                        path: "school"
                    }
                ]
            });

        res.status(200).json({
            success: true,
            message: "Trip completed successfully!",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getMyChildTrip = async (req, res) => {
    try {
        const students = await Student.find({
            parent: req.user.id
        });
        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No students found for this parent."
            });
        }
        const busIDs = students
            .filter((student) => student.bus)
            .map((student) => student.bus);

        if (busIDs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No buses assigned to your children."
            });
        }
        const trip = await Trip.findOne({
            bus: {
                $in: busIDs
            },
            status: {
                $in: ["scheduled", "in-progress"]
            }
        })
            .sort({ createdAt: -1 })
            .populate("bus")
            .populate("driver", "userID email role phone");

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "No active trip found."
            });
        }
        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getMyTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            driver: req.user.id,
            status: {
                $in: [
                    "scheduled",
                    "in-progress"
                ]
            }
        })
            .sort({
                createdAt: -1
            })
            .populate("bus")
            .populate(
                "driver",
                "userID email role phone"
            )
            .populate({
                path: "route",
                populate: [
                    {
                        path: "bus"
                    },
                    {
                        path: "school"
                    }
                ]
            });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "No active trip assigned to you."
            });
        }

        res.status(200).json({
            success: true,
            data: trip
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }

        if (trip.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Only scheduled trips can be deleted."
            });
        }
        const attendanceRecord = await Attendance.findOne({
            trip: trip._id
        });

        if (attendanceRecord) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this trip because attendance records exist."
            });
        }
        await Trip.findByIdAndDelete(trip._id);
        res.status(200).json({
            success: true,
            message: "Trip deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const startTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            tripID: req.params.tripID
        });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned driver can start this trip."
            });
        }

        if (trip.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: `Trip cannot be started because its status is ${trip.status}.`
            });
        }

        trip.status = "in-progress";
        trip.startedAt = new Date();

        await trip.save();

        await notifyParents(
            trip.bus,
            "Trip Started",
            "Your child's bus trip has started.",
            "trip-started"
        );

        const result = await Trip.findById(trip._id)
            .populate("bus")
            .populate(
                "driver",
                "userID email role phone"
            )
            .populate({
                path: "route",
                populate: [
                    {
                        path: "bus"
                    },
                    {
                        path: "school"
                    }
                ]
            });

        res.status(200).json({
            success: true,
            message: "Trip started successfully!",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {createTrip,getTripByID,updateTrip,updateTripLocation,completeTrip,getMyChildTrip,getMyTrip,deleteTrip,startTrip,};

