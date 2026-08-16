const mongoose = require("mongoose");
const schoolSchema = new mongoose.Schema(
    {
        schoolID: {
            type: String,
            required: [true, "Please enter the school ID"],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, "Please enter the school name"],
            trim: true
        },
        address: {
            type: String,
            required: [true, "Please enter the school address"],
            trim: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("School", schoolSchema);