import mongoose from "mongoose";

const AnniversarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
  },
  date: {
    type: String, // Format attendu : YYYY-MM-DD
    required: [true, "La date est requise"],
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  color: {
    type: String,
    default: "#cccccc",
  },
  allDay: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.models.Anniversary || mongoose.model("Anniversary", AnniversarySchema);
