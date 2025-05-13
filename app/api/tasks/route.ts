import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';

// GET : Récupérer toutes les tâches
export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('❌ Erreur API GET /tasks :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Créer une nouvelle tâche
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.label || typeof body.label !== 'string') {
      return NextResponse.json(
        { error: 'Le champ \"label\" est requis' },
        { status: 400 }
      );
    }

    const newTask = await Task.create(body);
    return NextResponse.json(newTask);
  } catch (error: any) {
    console.error('❌ Erreur API POST /tasks :', error.message);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    );
  }
}
