import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    label: { type: String, required: [true, 'Le nom de la tâche est requis'] },
    description: { type: String, default: '' },
    date: { type: Date }, // ✅ Date correcte pour les tris et filtres
    priority: { type: String, enum: ['Basse', 'Moyenne', 'Haute'], default: 'Moyenne' },
    category: { type: String },
    emoji: { type: String },
    color: { type: String, default: '#d8b985' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
