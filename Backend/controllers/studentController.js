const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const createStudent = async (req, res) => {
    try {
        const {studentID,name,parent,school,bus} = req.body;
        if (!studentID || !name || !parent || !school || !bus) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }
        const existingStudent = await Student.findOne({
            studentID
        });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student ID already exists."
            });
        }
        const student = await Student.create({studentID,name,parent,school,bus});
        res.status(201).json({
            success: true,
            message: "Student created successfully!",
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getStudentByID = async (req, res) => {
    try {
        const student = await Student.findOne({
            studentID: req.params.studentID
        })
            .populate("parent", "userID email phone role")
            .populate("school")
            .populate("bus");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }
        if (
            req.user.role === "parent" &&
            student.parent._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this student."
            });
        }
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateStudent = async (req, res) => {
    try {
        const updates = {};
        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }

        if (req.body.parent !== undefined) {
            updates.parent = req.body.parent;
        }

        if (req.body.school !== undefined) {
            updates.school = req.body.school;
        }

        if (req.body.bus !== undefined) {
            updates.bus = req.body.bus;
        }
        const student = await Student.findOneAndUpdate(
            {
                studentID: req.params.studentID
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("parent", "userID email phone role")
            .populate("school")
            .populate("bus");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Student updated successfully!",
            data: student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getMyChildren = async (req, res) => {
    try {
        const students = await Student.find({
            parent: req.user.id
        })
            .populate("school")
            .populate("bus");

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
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOne({
            studentID: req.params.studentID
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }
        const attendanceRecord = await Attendance.findOne({
            student: student._id
        });
        if (attendanceRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete this student because attendance records exist."
            });
        }
        await Student.findByIdAndDelete(student._id);
        res.status(200).json({
            success: true,
            message: "Student deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {createStudent,getStudentByID,updateStudent,getMyChildren,deleteStudent};
