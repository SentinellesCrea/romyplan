import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "ID invalide ou manquant" }, { status: 400 });
    }
    const deleted = await Budget.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Élément introuvable" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ Élément supprimé" });
  } catch (error) {
    console.error("❌ Erreur DELETE /budget/[id]", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
