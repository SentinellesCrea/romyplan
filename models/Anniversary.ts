// models/Anniversary.ts
import mongoose from "mongoose";

const AnniversarySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Le nom est requis'], },
  date: { type: String, required: [true, 'La date est requise'], }, // YYYY-MM-DD
  description: { type: String },
  color: { type: String },
  allDay: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Anniversary || mongoose.model("Anniversary", AnniversarySchema);
