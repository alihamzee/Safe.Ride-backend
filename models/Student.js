const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
        studentID: {
            type: String,
            required: [true, "Please enter the student ID"],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, "Please enter the student's name"],
            trim: true
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: [true, "Please select the student's school"]
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            required: [true, "Please select the student's bus"]
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Student", studentSchema);