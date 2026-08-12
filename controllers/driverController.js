const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const createDriver = async (req, res) => {
    try {
        const {driverID,name,licenseNumber,phone,user,bus} = req.body;
        if (!driverID || !name || !licenseNumber || !phone || !user) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingDriver = await Driver.findOne({
            $or: [
                { driverID },
                { licenseNumber },
                { user }
            ]
        });
        if (existingDriver) {
            return res.status(400).json({
                success: false,
                message: "Driver ID, license number, or user is already connected to a driver."
            });
        }
        const driver = await Driver.create({driverID,name,licenseNumber,phone,user,bus});
        const result = await Driver.findById(driver._id)
            .populate("bus")
            .populate(
                "user",
                "userID email role phone"
            );
        res.status(201).json({
            success: true,
            message: "Driver created successfully!",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getMyDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            user: req.user.id
        })
            .populate("bus")
            .populate(
                "user",
                "userID email role phone"
            );
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver profile not found."
            });
        }
        res.status(200).json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getDriverByID = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            driverID: req.params.driverID
        })
            .populate("bus")
            .populate(
                "user",
                "userID email role phone"
            );
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found."
            });
        }
        res.status(200).json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            driverID: req.params.driverID
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found."
            });
        }
        if (
            req.body.licenseNumber &&
            req.body.licenseNumber !== driver.licenseNumber
        ) {
            const existingLicense = await Driver.findOne({
                licenseNumber: req.body.licenseNumber
            });

            if (existingLicense) {
                return res.status(400).json({
                    success: false,
                    message: "License number already exists."
                });
            }
        }
        if (req.body.name !== undefined) {
            driver.name = req.body.name;
        }
        if (req.body.licenseNumber !== undefined) {
            driver.licenseNumber = req.body.licenseNumber;
        }
        if (req.body.phone !== undefined) {
            driver.phone = req.body.phone;
        }
        if (req.body.bus !== undefined) {
            driver.bus = req.body.bus;
        }
        await driver.save();
        const result = await Driver.findById(driver._id)
            .populate("bus")
            .populate(
                "user",
                "userID email role phone"
            );
        res.status(200).json({
            success: true,
            message: "Driver updated successfully!",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            driverID: req.params.driverID
        });
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found."
            });
        }

        const activeTrip = await Trip.findOne({
            driver: driver.user,
            status: {
                $in: ["scheduled", "in-progress"]
            }
        });
        if (activeTrip) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete this driver because they are assigned to active trip ${activeTrip.tripID}.`
            });
        }
        await Driver.findByIdAndDelete(driver._id);
        res.status(200).json({
            success: true,
            message: "Driver profile deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createDriver,getMyDriverProfile,getDriverByID,updateDriver,deleteDriver};