import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, locationLat, locationLng, locationName, notes } = body;

    const data: any = {
      lastStatusUpdate: new Date(),
    };

    if (status) data.status = status;
    if (locationLat !== undefined) data.locationLat = locationLat;
    if (locationLng !== undefined) data.locationLng = locationLng;
    if (locationName !== undefined) data.locationName = locationName;
    if (notes !== undefined) data.notes = notes;

    const member = await prisma.familyMember.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(member);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.familyMember.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Family member removed' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

