// ✅ app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "ID invalide ou manquant" }, { status: 400 });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Tâche introuvable" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Tâche supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /tasks/[id]", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}