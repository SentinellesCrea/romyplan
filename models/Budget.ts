import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est requis"],
    },
    category: {
      type: String,
      enum: ["Courses", "Shopping", "Loisirs", "Factures", "Dettes", "Salaire","Autre"],
      required: [true, "La catégorie est requise"],
    },
    amount: {
      type: Number,
      required: [true, "Le montant est requis"],
    },
    type: {
      type: String,
      enum: ["revenu", "dépense"],
      required: [true, "Le type est requis"],
    },
    date: {
      type: String,
      required: [true, "La date est requise"], // Format : YYYY-MM-DD
    },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
