import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
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
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
