import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.resourceInventory.findUnique({
      where: { id: params.id },
      include: { reliefCenter: true },
    });
    if (!item) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const existing = await prisma.resourceInventory.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 });
    }

    const quantity = body.quantity !== undefined ? Math.max(0, parseFloat(body.quantity)) : existing.quantity;
    const dailyRate =
      body.dailyConsumptionRate !== undefined
        ? Math.max(0, parseFloat(body.dailyConsumptionRate))
        : existing.dailyConsumptionRate;

    const updated = await prisma.resourceInventory.update({
      where: { id: params.id },
      data: {
        quantity,
        dailyConsumptionRate: dailyRate,
        lastRestocked: body.restocked ? new Date() : existing.lastRestocked,
        lastUpdated: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_INVENTORY',
        userId: user.id,
        entityType: 'ResourceInventory',
        entityId: updated.id,
        details: `Updated ${existing.resourceType} stock to ${quantity} ${existing.unit}`,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
