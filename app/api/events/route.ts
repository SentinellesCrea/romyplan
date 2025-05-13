// app/api/events/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// ✅ POST : créer un nouvel événement
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("📦 Données reçues :", body);

    const newEvent = new Event(body);
    const saved = await newEvent.save();

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json(
      { message: error.message, details: error.errors },
      { status: 400 }
    );
  }
}

// ✅ GET : récupérer les événements d’une date précise
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (dateStr) {
      // Si une date est précisée, on filtre
      const start = new Date(dateStr);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);

      const filteredEvents = await Event.find({
        date: { $gte: start, $lte: end },
      }).sort({ start: 1 });

      return NextResponse.json(filteredEvents);
    } else {
      // Sinon, on retourne tous les événements (pour le calendrier)
      const allEvents = await Event.find().sort({ date: 1 });
      return NextResponse.json(allEvents);
    }
  } catch (err: any) {
    console.error('❌ Erreur GET /events :', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
