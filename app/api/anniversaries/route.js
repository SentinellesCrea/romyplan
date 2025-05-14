import dbConnect from '../../../lib/dbConnect';
import Anniversary from '../../../models/Anniversary';

// GET : récupérer tous les anniversaires
export async function GET() {
  try {
    await dbConnect();
    const anniversaries = await Anniversary.find().sort({ date: 1 });
    return new Response(JSON.stringify(anniversaries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur GET anniversaries :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
    });
  }
}

// POST : créer un nouvel anniversaire
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.date) {
      return new Response(JSON.stringify({ message: 'Champs requis manquants' }), {
        status: 400,
      });
    }

    const newAnniversary = await Anniversary.create(body);
    return new Response(JSON.stringify(newAnniversary), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur POST anniversaries :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
