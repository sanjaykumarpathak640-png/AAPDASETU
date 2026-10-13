import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    const body = await req.json().catch(() => ({}));
    const targetResponderId = body.responderId || user?.id;

    if (!targetResponderId) {
      return NextResponse.json({ error: 'No responder specified' }, { status: 400 });
    }

    const responder = await prisma.user.findUnique({
      where: { id: targetResponderId },
    });

    if (!responder) {
      return NextResponse.json({ error: 'Responder not found' }, { status: 404 });
    }

    const updated = await prisma.sOSRequest.update({
      where: { id: params.id },
      data: {
        responderId: responder.id,
        status: 'ASSIGNED',
        updatedAt: new Date(),
      },
      include: { responder: true },
    });

    await prisma.sOSStatusHistory.create({
      data: {
        sosRequestId: params.id,
        status: 'ASSIGNED',
        note: `Case assigned to ${responder.name}`,
        changedBy: user?.name || 'Dispatcher',
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

