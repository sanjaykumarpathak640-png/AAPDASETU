export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [shelters, alerts, hospitals] = await Promise.all([
      prisma.shelter.findMany({
        where: { operationalStatus: { in: ['OPEN', 'FULL'] } },
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          totalCapacity: true,
          occupiedCapacity: true,
          availableBeds: true,
          hasFood: true,
          hasDrinkingWater: true,
          hasMedical: true,
          isAccessible: true,
          contactPhone: true,
          operationalStatus: true,
        },
      }),
      prisma.publicAlert.findMany({
        where: { isPublished: true },
        take: 5,
        orderBy: { validFrom: 'desc' },
      }),
      prisma.hospital.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          availableBeds: true,
          contactPhone: true,
        },
      }),
    ]);

    const emergencyContacts = [
      {
        number: '112',
        title: 'National Emergency Helpline (Police / Fire / Disaster)',
        desc: 'Single national emergency support line across India. Toll-free 24x7.',
        priority: 1,
      },
      {
        number: '1077',
        title: 'District Disaster Management Authority (DDMA / DEOC)',
        desc: 'Direct line to District Emergency Operations Center for flood rescue & boats.',
        priority: 2,
      },
      {
        number: '108',
        title: 'Emergency Medical & Ambulance Transport',
        desc: 'Ambulance dispatch for trauma, severe injury, and immediate patient transfer.',
        priority: 3,
      },
      {
        number: '1070',
        title: 'State Disaster Management Control Room (SDMA Bihar)',
        desc: 'State-level coordination and NDRF / SDRF deployment tracking.',
        priority: 4,
      },
    ];

    const emergencyInstructions = [
      {
        step: 1,
        title: 'Turn off electricity and gas mains',
        detail: 'Prevent electrocution and gas explosion hazard before water reaches wall switches.',
      },
      {
        step: 2,
        title: 'Move vertically to highest elevation',
        detail: 'Ascend to second floor or reinforced rooftop. Avoid trapped attics with no roof exit.',
      },
      {
        step: 3,
        title: 'Never drive or walk through moving water',
        detail: 'Just 15 cm (6 inches) of rapid water can sweep an adult; 30 cm can float a vehicle.',
      },
      {
        step: 4,
        title: 'Signal for assistance',
        detail: 'Wave bright cloth or flash torchlight at helicopters or rescue boats.',
      },
    ];

    return NextResponse.json({
      bundleVersion: '2026.10',
      syncedAt: new Date().toISOString(),
      emergencyContacts,
      emergencyInstructions,
      shelters,
      hospitals,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

