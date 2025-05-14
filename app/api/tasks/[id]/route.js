import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Task from '../../../../models/Task';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Task.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return new Response(JSON.stringify({ message: 'Tâche non trouvée' }), { status: 404 });
    }
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error('❌ PUT /tasks/[id] :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const deleted = await Task.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: 'Tâche non trouvée' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Tâche supprimée' }), { status: 200 });
  } catch (error) {
    console.error('❌ DELETE /tasks/[id] :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}
