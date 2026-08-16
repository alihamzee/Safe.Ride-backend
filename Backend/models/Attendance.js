const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: [true, "Please select the trip"]
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: [true, "Please select the student"]
        },
        status: {
            type: String,
            enum: ["waiting","picked-up","dropped-off"],
            default: "waiting"
        },
        pickedUpAt: {
            type: Date,
            default: null
        },
        droppedOffAt: {
            type: Date,
            default: null
        }
    },
    {timestamps: true}
);
attendanceSchema.index({trip: 1,student: 1},{unique: true});

module.exports = mongoose.model("Attendance",attendanceSchema);