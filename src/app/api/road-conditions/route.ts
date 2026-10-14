export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const roads = await prisma.roadCondition.findMany({
      orderBy: { reportedAt: 'desc' },
    });
    return NextResponse.json(roads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

