const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [true, "Please enter your ID"],
        minlength: 3,
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 8,
        trim: true,
    },
    passwordChangedAt: Date,

    role: {
        type: String,
        enum: ["admin", "parent", "driver"],
        default: "parent",
    },

    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    isActive: {
    type: Boolean,
    default: true
    },
},
{timestamps: true,}
);

module.exports = mongoose.model("User", userSchema);