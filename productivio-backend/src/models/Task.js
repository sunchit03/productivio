const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    dueDate: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
