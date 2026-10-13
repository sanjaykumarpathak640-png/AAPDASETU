import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateSOSPriority } from '@/lib/algorithms/sosScoring';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    // Allow public demo viewing or responder/admin
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const requests = await prisma.sOSRequest.findMany({
      where,
      include: {
        responder: { select: { id: true, name: true, phone: true } },
        statusHistory: { orderBy: { timestamp: 'desc' } },
      },
      orderBy: [
        { priorityScore: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      emergencyType,
      description,
      latitude,
      longitude,
      address,
      peopleCount,
      hasVulnerable,
      contactName,
      contactPhone,
      nearbyRiskLevel,
    } = body;

    if (!emergencyType || !description) {
      return NextResponse.json(
        { error: 'Emergency type and description are required' },
        { status: 400 }
      );
    }

    const count = parseInt(peopleCount || '1');
    const lat = latitude ? parseFloat(latitude) : 25.6154;
    const lng = longitude ? parseFloat(longitude) : 85.1212;

    // Calculate priority using algorithm
    const priority = calculateSOSPriority({
      emergencyType,
      peopleCount: count,
      hasVulnerable: !!hasVulnerable,
      nearbyRiskLevel: nearbyRiskLevel || 'HIGH',
      description,
    });

    // Generate unique SOS number (e.g. SOS-2049)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestNumber = `SOS-${randomSuffix}`;

    const sos = await prisma.sOSRequest.create({
      data: {
        requestNumber,
        emergencyType,
        description,
        latitude: lat,
        longitude: lng,
        address: address || 'Current User GPS Coordinates',
        peopleCount: count,
        hasVulnerable: !!hasVulnerable,
        contactName: contactName || 'Anonymous Citizen',
        contactPhone: contactPhone || 'Not provided',
        priorityScore: priority.score,
        priorityLevel: priority.level,
        priorityReason: priority.reason,
        status: 'REPORTED',
        isDemo: true,
        statusHistory: {
          create: {
            status: 'REPORTED',
            note: 'Emergency request registered via citizen application',
            changedBy: contactName || 'Citizen',
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: sos,
      message: `Emergency request ${requestNumber} registered with priority ${priority.level}.`,
      priority,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit SOS request' }, { status: 500 });
  }
}

