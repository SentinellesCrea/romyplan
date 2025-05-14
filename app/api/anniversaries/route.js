import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Anniversary from '../../../models/Anniversary';

// GET : récupérer tous les anniversaires
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');

  await dbConnect();

  if (dateStr) {
    const filtered = await Anniversary.find({ date: { $regex: `^${dateStr}` } }).sort({ date: -1 });
    return NextResponse.json(filtered);
  }

  const all = await Anniversary.find().sort({ date: -1 });
  return NextResponse.json(all);
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
