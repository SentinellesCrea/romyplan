import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anniversary from '@/models/Anniversary';

// GET : récupérer tous les anniversaires
export async function GET() {
  try {
    await dbConnect();
    const anniversaries = await Anniversary.find().sort({ date: 1 });
    return NextResponse.json(anniversaries);
  } catch (error) {
    console.error('❌ Erreur GET anniversaries :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : créer un nouvel anniversaire
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.date) {
      return NextResponse.json(
        { message: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const newAnniversary = await Anniversary.create(body);
    return NextResponse.json(newAnniversary, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur POST anniversaries :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
