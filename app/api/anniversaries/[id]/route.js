import dbConnect from '../../../lib/dbConnect';
import Anniversary from '../../../models/Anniversary';

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

    const deleted = await Anniversary.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: 'Anniversaire introuvable' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: '✅ Anniversaire supprimé' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur DELETE /anniversaries/[id]', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
