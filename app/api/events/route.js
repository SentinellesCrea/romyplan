import dbConnect from '../../../lib/dbConnect';
import Event from '../../../models/Event';

// ✅ POST : créer un nouvel événement
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log('📦 Données reçues :', body);

    const newEvent = new Event(body);
    const saved = await newEvent.save();

    return new Response(JSON.stringify(saved), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur serveur :', error);
    return new Response(JSON.stringify({
      message: error.message || 'Erreur serveur',
      details: error.errors || null,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ✅ GET : récupérer les événements d’une date précise
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    let result;

    if (dateStr) {
      const start = new Date(dateStr);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);

      result = await Event.find({
        date: { $gte: start, $lte: end },
      }).sort({ start: 1 });
    } else {
      result = await Event.find().sort({ date: 1 });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Erreur GET /events :', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
