import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
    },
    color: {
      type: String,
      default: '#cccccc',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
