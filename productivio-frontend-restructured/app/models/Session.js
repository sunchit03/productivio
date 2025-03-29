import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    currentMode: { type: String, required: true, default: "work"},
    focusSeconds:{ type: Number, default: 0 },
    breakSeconds: { type: Number, default: 0 },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
    workAmounts: { type: Number, default: 0 },
    breakAmounts: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
