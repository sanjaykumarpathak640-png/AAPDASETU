import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: params.id },
    });
    if (!shelter) {
      return NextResponse.json({ error: 'Shelter not found' }, { status: 404 });
    }
    return NextResponse.json(shelter);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required to update shelter' }, { status: 403 });
    }

    const body = await req.json();
    const existing = await prisma.shelter.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Shelter not found' }, { status: 404 });
    }

    // Capacity validation
    let totalCap = body.totalCapacity !== undefined ? parseInt(body.totalCapacity) : existing.totalCapacity;
    let occCap = body.occupiedCapacity !== undefined ? parseInt(body.occupiedCapacity) : existing.occupiedCapacity;
    let availBeds = body.availableBeds !== undefined ? parseInt(body.availableBeds) : existing.availableBeds;

    if (totalCap < 0 || occCap < 0 || availBeds < 0) {
      return NextResponse.json({ error: 'Capacities and beds cannot be negative' }, { status: 400 });
    }
    if (occCap > totalCap) {
      return NextResponse.json(
        { error: `Occupied capacity (${occCap}) cannot exceed total capacity (${totalCap})` },
        { status: 400 }
      );
    }

    const updated = await prisma.shelter.update({
      where: { id: params.id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        address: body.address !== undefined ? body.address : existing.address,
        totalCapacity: totalCap,
        occupiedCapacity: occCap,
        availableBeds: availBeds,
        hasFood: body.hasFood !== undefined ? !!body.hasFood : existing.hasFood,
        hasDrinkingWater: body.hasDrinkingWater !== undefined ? !!body.hasDrinkingWater : existing.hasDrinkingWater,
        hasMedical: body.hasMedical !== undefined ? !!body.hasMedical : existing.hasMedical,
        hasToilets: body.hasToilets !== undefined ? !!body.hasToilets : existing.hasToilets,
        hasElectricity: body.hasElectricity !== undefined ? !!body.hasElectricity : existing.hasElectricity,
        isAccessible: body.isAccessible !== undefined ? !!body.isAccessible : existing.isAccessible,
        operationalStatus: body.operationalStatus || existing.operationalStatus,
        lastUpdated: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_SHELTER',
        userId: user.id,
        entityType: 'Shelter',
        entityId: updated.id,
        details: `Updated occupancy to ${occCap}/${totalCap}, status: ${updated.operationalStatus}`,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

