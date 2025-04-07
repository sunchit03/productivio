import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { 
        type: String,
        required: true,
        enum: [
            'task-allocate', 
            'task-deallocate', 
            'team-member-addition', 
            'team-member-removal', 
            'team-admin-assignment', 
            'team-deletion'
        ],
    },
    new: { type: Boolean, required: true, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }, { timestamps: true });
  
module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);