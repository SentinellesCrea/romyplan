import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Le nom de la tâche est requis"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  date: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Basse", "Moyenne", "Haute"],
    default: "Moyenne",
  },
  category: {
    type: String,
    default: "Général",
  },
  emoji: {
    type: String,
    default: "✅",
  },
  color: {
    type: String,
    default: "#d8b985",
  },
  done: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
