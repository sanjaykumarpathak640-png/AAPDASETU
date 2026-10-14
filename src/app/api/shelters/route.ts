export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rankShelters } from '@/lib/algorithms/shelterScoring';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const sort = searchParams.get('sort') || 'safest'; // safest, nearest, occupancy
    const medicalOnly = searchParams.get('medical') === 'true';
    const accessibleOnly = searchParams.get('accessible') === 'true';

    const lat = latStr ? parseFloat(latStr) : 25.6154;
    const lng = lngStr ? parseFloat(lngStr) : 85.1212;

    const where: any = {};
    if (medicalOnly) where.hasMedical = true;
    if (accessibleOnly) where.isAccessible = true;

    const shelters = await prisma.shelter.findMany({ where });

    let ranked = rankShelters(shelters as any, lat, lng, 60);

    if (sort === 'nearest') {
      ranked.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === 'occupancy') {
      ranked.sort((a, b) => a.occupancyPercent - b.occupancyPercent);
    }

    return NextResponse.json(ranked);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      address,
      latitude,
      longitude,
      totalCapacity,
      occupiedCapacity,
      availableBeds,
      hasFood,
      hasDrinkingWater,
      hasMedical,
      hasToilets,
      hasElectricity,
      isAccessible,
      contactPhone,
      operationalStatus,
    } = body;

    if (!name || !address || latitude === undefined || longitude === undefined || !totalCapacity) {
      return NextResponse.json({ error: 'Missing required shelter fields' }, { status: 400 });
    }

    const shelter = await prisma.shelter.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        totalCapacity: parseInt(totalCapacity),
        occupiedCapacity: parseInt(occupiedCapacity || 0),
        availableBeds: parseInt(availableBeds || totalCapacity),
        hasFood: !!hasFood,
        hasDrinkingWater: !!hasDrinkingWater,
        hasMedical: !!hasMedical,
        hasToilets: !!hasToilets,
        hasElectricity: !!hasElectricity,
        isAccessible: !!isAccessible,
        contactPhone,
        operationalStatus: operationalStatus || 'OPEN',
        isDemo: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_SHELTER',
        userId: user.id,
        entityType: 'Shelter',
        entityId: shelter.id,
        details: `Created shelter ${shelter.name}`,
      },
    });

    return NextResponse.json(shelter, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

