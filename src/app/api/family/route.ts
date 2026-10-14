export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    // In demo mode or if user has group, fetch primary group
    let familyGroup = await prisma.familyGroup.findFirst({
      include: {
        members: {
          orderBy: { lastStatusUpdate: 'desc' },
        },
      },
    });

    if (!familyGroup) {
      familyGroup = await prisma.familyGroup.create({
        data: {
          name: 'My Emergency Family Circle',
          createdById: user?.id,
        },
        include: { members: true },
      });
    }

    return NextResponse.json(familyGroup);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, status, notes, locationName } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    let familyGroup = await prisma.familyGroup.findFirst();
    if (!familyGroup) {
      familyGroup = await prisma.familyGroup.create({
        data: { name: 'Emergency Family Circle' },
      });
    }

    const member = await prisma.familyMember.create({
      data: {
        familyGroupId: familyGroup.id,
        name,
        role: role.toUpperCase(),
        status: status || 'SAFE',
        notes,
        locationName,
        lastStatusUpdate: new Date(),
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

