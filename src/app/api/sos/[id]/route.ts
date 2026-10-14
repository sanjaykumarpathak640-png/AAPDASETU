import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const sos = await prisma.sOSRequest.findUnique({
      where: { id: params.id },
      include: {
        responder: true,
        statusHistory: { orderBy: { timestamp: 'desc' } },
      },
    });

    if (!sos) {
      return NextResponse.json({ error: 'SOS Request not found' }, { status: 404 });
    }

    return NextResponse.json(sos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    // Allow responder or admin to update status and notes
    const body = await req.json();
    const { status, responderNotes, responderId } = body;

    const existing = await prisma.sOSRequest.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'SOS Request not found' }, { status: 404 });
    }

    const dataToUpdate: any = {
      updatedAt: new Date(),
    };

    if (responderNotes !== undefined) dataToUpdate.responderNotes = responderNotes;
    if (responderId !== undefined) dataToUpdate.responderId = responderId;

    if (status && status !== existing.status) {
      dataToUpdate.status = status;
      if (status === 'RESOLVED') {
        dataToUpdate.resolvedAt = new Date();
      }
      // Add status history entry
      await prisma.sOSStatusHistory.create({
        data: {
          sosRequestId: params.id,
          status,
          note: responderNotes || `Status updated to ${status}`,
          changedBy: user ? `${user.name} (${user.role})` : 'Responder Field Unit',
        },
      });
    }

    const updated = await prisma.sOSRequest.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: {
        responder: true,
        statusHistory: { orderBy: { timestamp: 'desc' } },
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

