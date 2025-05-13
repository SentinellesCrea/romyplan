import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anniversary from '@/models/Anniversary';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "ID invalide ou manquant" }, { status: 400 });
    }
    const deleted = await Anniversary.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Anniversaire introuvable" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ Anniversaire supprimé" });
  } catch (error) {
    console.error("❌ Erreur DELETE /anniversaries/[id]", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}