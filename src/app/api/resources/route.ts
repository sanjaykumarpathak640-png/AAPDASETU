export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { predictResourceShortage } from '@/lib/algorithms/reliefPrediction';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // FOOD, DRINKING_WATER, etc.

    const reliefCenters = await prisma.reliefCenter.findMany({
      include: {
        inventories: true,
      },
      orderBy: { name: 'asc' },
    });

    const centersWithProjections = reliefCenters.map((center) => {
      const projectedInventories = center.inventories
        .filter((inv) => !category || inv.resourceType === category)
        .map((inv) => {
          const prediction = predictResourceShortage(inv as any, 7, 20);
          return {
            ...inv,
            prediction,
          };
        });

      return {
        ...center,
        inventories: projectedInventories,
      };
    });

    return NextResponse.json(centersWithProjections);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

