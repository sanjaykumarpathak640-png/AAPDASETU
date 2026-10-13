import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      orderBy: { availableBeds: 'desc' },
    });
    return NextResponse.json(hospitals);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

