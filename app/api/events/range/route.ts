// app/api/events/range/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const start = new Date(searchParams.get('start'));
    const end = new Date(searchParams.get('end'));

    const events = await Event.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
