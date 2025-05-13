// app/api/budget/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

// GET : récupérer toutes les lignes de budget
export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find().sort({ date: -1 }); // plus récents d’abord
    return NextResponse.json(budgets);
  } catch (error: any) {
    console.error('❌ Erreur GET /budget :', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST : créer une nouvelle ligne budget
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { titre, category, amount, type, date } = body;
    if (!titre || !category || !amount || !type || !date) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const created = await Budget.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('❌ Erreur POST /budget :', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
