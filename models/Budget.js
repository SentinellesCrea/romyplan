import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Courses', 'Shopping', 'Loisirs', 'Factures', 'Dettes', 'Salaire', 'Autre'],
      required: [true, 'La catégorie est requise'],
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: [0, 'Le montant doit être supérieur ou égal à 0'],
    },
    type: {
      type: String,
      enum: ['revenu', 'dépense'],
      required: [true, 'Le type est requis'],
    },
    date: {
      type: String, // Format : YYYY-MM-DD
      required: [true, 'La date est requise'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
