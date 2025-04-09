import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  connection: {
    type: String,
    required: true,
    enum: ['auth0', 'google-oauth2'],
  },
  lists: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'List' 
    }
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    }
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    }
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    }
  ]
});

userSchema.index({ email: 1, connection: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
