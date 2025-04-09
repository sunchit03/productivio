import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String , trim: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', default: null }, // If null, it's in the inbox
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null }, // Null means it's a personal task
  isCompleted: { type: Boolean, default: false },
  isTrash: { type: Boolean, default: false },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['1', '2', '3', '4'], default: '4' },
  files: [
    {
      name: String,
      key: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
