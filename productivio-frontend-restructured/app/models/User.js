import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  connection: {
    type: String,
    required: true,
    enum: ['auth0', 'google-oauth2'],
  },
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
