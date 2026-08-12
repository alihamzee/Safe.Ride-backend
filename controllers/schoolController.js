const School = require("../models/School");
const Student = require("../models/Student");
const createSchool = async (req, res) => {
    try {
        const {schoolID,name,address} = req.body;
        if (!schoolID || !name || !address) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingSchool = await School.findOne({
            schoolID
        });
        if (existingSchool) {
            return res.status(400).json({
                success: false,
                message: "School ID already exists."
            });
        }
        const school = await School.create({
            schoolID,
            name,
            address
        });
        res.status(201).json({
            success: true,
            message: "School created successfully!",
            data: school
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getSchoolByID = async (req, res) => {
    try {
        const school = await School.findOne({
            schoolID: req.params.schoolID
        });
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found."
            });
        }
        res.status(200).json({
            success: true,
            data: school
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateSchool = async (req, res) => {
    try {
        const updates = {};
        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }

        if (req.body.address !== undefined) {
            updates.address = req.body.address;
        }
        const school = await School.findOneAndUpdate(
            {
                schoolID: req.params.schoolID
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "School updated successfully!",
            data: school
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteSchool = async (req, res) => {
    try {
        const school = await School.findOne({
            schoolID: req.params.schoolID
        });
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found."
            });
        }
        const studentUsingSchool = await Student.findOne({
            school: school._id
        });
        if (studentUsingSchool) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this school because a student is assigned to it."
            });
        }
        await School.findByIdAndDelete(school._id);
        res.status(200).json({
            success: true,
            message: "School deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createSchool,getSchoolByID,updateSchool,deleteSchool};
