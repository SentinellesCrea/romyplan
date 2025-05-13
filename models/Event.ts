import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Le titre est requis'] },
  address: { type: String },
  date: { type: Date, required: [true, 'La date est requise'] },

  start: { type: Date }, // ✅ heure de début
  end: { type: Date },   // ✅ heure de fin

  allDay: { type: Boolean, default: false },

  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
  },

  color: { type: String },
}, {
  timestamps: false,
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
