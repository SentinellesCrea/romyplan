import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "ID invalide ou manquant" }, { status: 400 });
    }
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Événement introuvable" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ Événement supprimé" });
  } catch (error) {
    console.error("❌ Erreur DELETE /events/[id]", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}