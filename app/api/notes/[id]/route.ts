import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "ID invalide ou manquant" }, { status: 400 });
    }
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Note introuvable" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ Note supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /notes/[id]", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
