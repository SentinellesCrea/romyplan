import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Budget from '../../../models/Budget';

// GET : récupérer toutes les lignes de budget
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');

  await dbConnect();

  if (dateStr) {
    const filtered = await Budget.find({ date: { $regex: `^${dateStr}` } }).sort({ date: -1 });
    return NextResponse.json(filtered);
  }

  const all = await Budget.find().sort({ date: -1 });
  return NextResponse.json(all);
}


// POST : créer une nouvelle ligne budget
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { titre, category, amount, type, date } = body;
    if (!titre || !category || !amount || !type || !date) {
      return new Response(JSON.stringify({ message: 'Champs requis manquants' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const created = await Budget.create(body);
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur POST /budget :', error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
