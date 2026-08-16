const mongoose = require("mongoose");
const driverSchema = new mongoose.Schema({
        driverID: {
            type: String,
            required: [true, "Please enter the driver ID"],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, "Please enter the driver's name"],
            trim: true
        },
        licenseNumber: {
            type: String,
            required: [true, "Please enter the driver's license number"],
            unique: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Please enter the driver's phone number"],
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Driver", driverSchema);