const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema(
    {
        tripID: {
            type: String,
            required: [true, "Please enter the trip ID"],
            unique: true,
            trim: true
        },

        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            required: [true, "Please select the bus"]
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please select the driver"]
        },

        // Route assigned to this trip
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            default: null
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "in-progress",
                "completed"
            ],
            default: "scheduled"
        },

        currentLocation: {
            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        startedAt: {
            type: Date,
            default: null
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Trip",tripSchema);