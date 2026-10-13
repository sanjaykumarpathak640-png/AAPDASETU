import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const riskZones = await prisma.riskZone.findMany({
      orderBy: { riskScore: 'desc' },
    });
    return NextResponse.json(riskZones);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

