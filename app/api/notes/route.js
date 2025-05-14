import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';

// GET : récupérer toutes les notes
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');

  await dbConnect();

  if (dateStr) {
    const start = new Date(dateStr);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const filtered = await Note.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    return NextResponse.json(filtered);
  }

  const all = await Note.find().sort({ date: -1 });
  return NextResponse.json(all);
}


// POST : créer une nouvelle note
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.date) {
      return new Response(JSON.stringify({ message: 'Le titre et la date sont requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newNote = await Note.create(body);
    return new Response(JSON.stringify(newNote), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur POST /notes :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
