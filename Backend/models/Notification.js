const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: [true, "Please enter notification title"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Please enter notification message"],
            trim: true
        },
        type: {
            type: String,
            enum: [
                "trip-started",
                "bus-update",
                "trip-completed",
                "general"
            ],
            default: "general"
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);
module.exports = mongoose.model("Notification",notificationSchema);