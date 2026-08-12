const User = require("../models/User");
const Student = require("../models/Student");
const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const School = require("../models/School");
const Trip = require("../models/Trip");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");
const getDashboard = async (req, res) => {
    try {
        const totalParents = await User.countDocuments({
            role: "parent"
        });

        const totalDriverUsers = await User.countDocuments({
            role: "driver"
        });
        const totalStudents = await Student.countDocuments();
        const totalBuses = await Bus.countDocuments();
        const totalDrivers = await Driver.countDocuments();
        const totalSchools = await School.countDocuments();
        const totalTrips = await Trip.countDocuments();

        const scheduledTrips = await Trip.countDocuments({
            status: "scheduled"
        });

        const activeTrips = await Trip.countDocuments({
            status: "in-progress"
        });

        const completedTrips = await Trip.countDocuments({
            status: "completed"
        });

        res.status(200).json({
            success: true,
            data: {
                users: {
                    parents: totalParents,
                    driverAccounts: totalDriverUsers
                },

                students: totalStudents,
                buses: totalBuses,
                drivers: totalDrivers,
                schools: totalSchools,

                trips: {
                    total: totalTrips,
                    scheduled: scheduledTrips,
                    active: activeTrips,
                    completed: completedTrips
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

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate(
                "parent",
                "userID email phone role"
            )
            .populate("school")
            .populate("bus")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate(
                "user",
                "userID email phone role"
            )
            .populate("bus")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: schools.length,
            data: schools
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate("bus")
            .populate(
                "driver",
                "userID email phone role"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const {userID,email,password,phone,role} = req.body;

        if (!userID || !email || !password || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Admin can only create parent or driver accounts
        if (!["parent", "driver"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be parent or driver."
            });
        }

        const existingEmail = await User.findOne({
            email
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const existingUserID = await User.findOne({
            userID
        });

        if (existingUserID) {
            return res.status(400).json({
                success: false,
                message: "User ID already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            userID,
            email,
            password: hashedPassword,
            phone,
            role
        });

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: {
                id: user._id,
                userID: user.userID,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (
            req.body.email &&
            req.body.email !== user.email
        ) {
            const existingEmail = await User.findOne({
                email: req.body.email
            });

            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered."
                });
            }

            user.email = req.body.email;
        }


        if (req.body.phone !== undefined) {
            user.phone = req.body.phone;
        }


        if (req.body.password) {
            user.password = await bcrypt.hash(
                req.body.password,
                10
            );
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: {
                id: user._id,
                userID: user.userID,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            userID: req.params.userID
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin accounts cannot be deleted here."
            });
        }

        if (user.role === "parent") {
            const student = await Student.findOne({
                parent: user._id
            });

            if (student) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot delete this parent because students are assigned to them."
                });
            }
        }

        if (user.role === "driver") {
            const driverProfile = await Driver.findOne({
                user: user._id
            });

            if (driverProfile) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cannot delete this user because a driver profile is connected to it."
                });
            }
        }

        const trip = await Trip.findOne({
            driver: user._id
        });

        if (trip) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete this user because trip history is connected to the account."
            });
        }

   
        await Notification.deleteMany({
            user: user._id
        });


        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const {
            isActive
        } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false."
            });
        }

        const user = await User.findOne({
            userID: req.params.userID
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin accounts cannot be disabled here."
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "User account activated successfully!"
                : "User account disabled successfully!",

            data: {
                id: user._id,
                userID: user.userID,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {getDashboard,getAllStudents,getAllDrivers,getAllBuses,getAllSchools,getAllTrips,getAllUsers,createUser,updateUser,deleteUser,updateUserStatus};