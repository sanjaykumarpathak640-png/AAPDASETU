import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const readings = await prisma.sensorReading.findMany({
      where: { stationId: params.id },
      orderBy: { timestamp: 'asc' },
    });
    return NextResponse.json(readings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

