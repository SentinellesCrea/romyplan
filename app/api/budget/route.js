import dbConnect from '../../../lib/dbConnect';
import Budget from '../../../models/Budget';

// GET : récupérer toutes les lignes de budget
export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find().sort({ date: -1 }); // les plus récents d'abord
    return new Response(JSON.stringify(budgets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur GET /budget :', error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
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
