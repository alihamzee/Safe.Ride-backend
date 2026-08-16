const mongoose = require("mongoose");
const busSchema = new mongoose.Schema({
        busID: {
            type: String,
            required: [true, "Please enter the bus ID"],
            unique: true,
            trim: true
        },
        busNumber: {
            type: String,
            required: [true, "Please enter the bus number"],
            trim: true
        },
        capacity: {
            type: Number,
            required: [true, "Please enter the bus capacity"]
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Bus", busSchema);