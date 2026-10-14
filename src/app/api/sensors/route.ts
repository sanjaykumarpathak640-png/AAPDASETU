export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sensors = await prisma.sensorStation.findMany({
      include: {
        readings: {
          take: 10,
          orderBy: { timestamp: 'desc' },
        },
      },
    });
    return NextResponse.json(sensors);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

