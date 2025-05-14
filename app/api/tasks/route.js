import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Task from '../../../models/Task';

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error('❌ GET /tasks :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const task = await Task.create(body);
    return new Response(JSON.stringify(task), { status: 201 });
  } catch (error) {
    console.error('❌ POST /tasks :', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}
