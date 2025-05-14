import dbConnect from '../../../lib/dbConnect';
import Event from '../../../models/Event';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ message: 'ID invalide ou manquant' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: 'Événement introuvable' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: '✅ Événement supprimé' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur DELETE /events/[id]', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
