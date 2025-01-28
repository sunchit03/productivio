const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  connectionType: {
    type: String,
    required: true,
    enum: ['Username-Password-Authentication', 'google-oauth2'],
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
