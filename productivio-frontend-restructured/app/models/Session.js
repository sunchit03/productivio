import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    focusSeconds: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

}, { timestamps: true });

module.exports = mongoose.models.PomoSession || mongoose.model('PomoSession', sessionSchema);
