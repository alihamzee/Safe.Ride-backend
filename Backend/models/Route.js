const mongoose = require("mongoose");
const stopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    },
    {_id: false}
);
const routeSchema = new mongoose.Schema(
    {
        routeID: {
            type: String,
            required: [true, "Please enter route ID"],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, "Please enter route name"],
            trim: true
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            required: [true, "Please select a bus"]
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: [true, "Please select a school"]
        },
        direction: {
            type: String,
            enum: ["pickup", "dropoff"],
            required: true
        },
        stops: {
            type: [stopSchema],
            default: []
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Route", routeSchema);