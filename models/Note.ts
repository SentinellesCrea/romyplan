import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
    },
    content: {
      type: String,
      default: '',
    },
    date: {
      type: Date, // ✅ vrai champ de date
      required: true,
    },
    color: {
      type: String,
      default: '#f59e0b',
    },
    emoji: {
      type: String,
      default: '📝',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
