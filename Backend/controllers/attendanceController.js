const Attendance = require("../models/Attendance");
const Trip = require("../models/Trip");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const markPickedUp = async (req, res) => {
    try {
        const { tripID, studentID } = req.params;
        const trip = await Trip.findOne({ tripID });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned driver can update attendance."
            });
        }
        if (trip.status !== "in-progress") {
            return res.status(400).json({
                success: false,
                message: "Attendance can only be updated during an active trip."
            });
        }
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }
        if (student.bus.toString() !== trip.bus.toString()) {
            return res.status(400).json({
                success: false,
                message: "This student is not assigned to this trip's bus."
            });
        }
        let attendance = await Attendance.findOne({
            trip: trip._id,
            student: student._id
        });
        if (!attendance) {
            attendance = await Attendance.create({
                trip: trip._id,
                student: student._id,
                status: "picked-up",
                pickedUpAt: new Date()
            });
        } else {
            if (
                attendance.status === "picked-up" ||
                attendance.status === "dropped-off"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Student has already been picked up."
                });
            }

            attendance.status = "picked-up";
            attendance.pickedUpAt = new Date();

            await attendance.save();
        }
        await Notification.create({
            user: student.parent,
            title: "Student Picked Up",
            message: `${student.name} has boarded the school bus.`,
            type: "general"
        });
        const result = await Attendance.findById(attendance._id)
            .populate("student")
            .populate("trip");
        res.status(200).json({
            success: true,
            message: `${student.name} marked as picked up.`,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const markDroppedOff = async (req, res) => {
    try {
        const { tripID, studentID } = req.params;

        // Find trip
        const trip = await Trip.findOne({ tripID });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned driver can update attendance."
            });
        }
        if (trip.status !== "in-progress") {
    return res.status(400).json({
        success: false,
        message: "Attendance can only be updated during an active trip."
    });
}
        const student = await Student.findOne({ studentID });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        if (student.bus.toString() !== trip.bus.toString()) {
            return res.status(400).json({
                success: false,
                message: "This student is not assigned to this trip's bus."
            });
        }
        const attendance = await Attendance.findOne({
            trip: trip._id,
            student: student._id
        });
        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Student has not been picked up yet."
            });
        }
        if (attendance.status !== "picked-up") {
            return res.status(400).json({
                success: false,
                message: "Student cannot be dropped off before being picked up."
            });
        }
        attendance.status = "dropped-off";
        attendance.droppedOffAt = new Date();
        await attendance.save();
        await Notification.create({
            user: student.parent,
            title: "Student Dropped Off",
            message: `${student.name} has been dropped off safely.`,
            type: "general"
        });
        const result = await Attendance.findById(attendance._id)
            .populate("student")
            .populate("trip");
        res.status(200).json({
            success: true,
            message: `${student.name} marked as dropped off.`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getTripAttendance = async (req, res) => {
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
        const attendance = await Attendance.find({
            trip: trip._id
        })
            .populate("student")
            .populate("trip");

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getMyChildAttendance = async (req, res) => {
    try {
        const { studentID } = req.params;
        if (req.user.role !== "parent") {
            return res.status(403).json({
                success: false,
                message: "Only parents can access this information."
            });
        }
        const student = await Student.findOne({
            studentID: studentID
        })
            .populate("bus")
            .populate("school");
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }
        if (student.parent.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this student."
            });
        }
        if (!student.bus) {
            return res.status(404).json({
                success: false,
                message: "No bus assigned to this student."
            });
        }
        const trip = await Trip.findOne({
            bus: student.bus._id
        })
            .sort({ createdAt: -1 })
            .populate("bus")
            .populate("driver", "userID email role phone");
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "No trip found for this student's bus."
            });
        }
        const attendance = await Attendance.findOne({
            trip: trip._id,
            student: student._id
        });
        const status = attendance
            ? attendance.status
            : "waiting";
        res.status(200).json({
            success: true,
            data: {
                student: {
                    studentID: student.studentID,
                    name: student.name
                },
                school: student.school,
                bus: student.bus,
                trip: {
                    tripID: trip.tripID,
                    status: trip.status,
                    currentLocation: trip.currentLocation,
                    driver: trip.driver
                },
                attendance: {
                    status: status,
                    pickedUpAt: attendance
                        ? attendance.pickedUpAt
                        : null,
                    droppedOffAt: attendance
                        ? attendance.droppedOffAt
                        : null
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {markPickedUp,markDroppedOff,getTripAttendance,getMyChildAttendance};
