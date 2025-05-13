import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';

// GET : récupérer toutes les notes
export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find().sort({ date: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('❌ Erreur GET /notes :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : créer une nouvelle note
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.date) {
      return NextResponse.json(
        { message: 'Le titre et la date sont requis' },
        { status: 400 }
      );
    }

    const newNote = await Note.create(body);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur POST /notes :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
