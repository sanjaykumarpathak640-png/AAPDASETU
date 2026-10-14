import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const alert = await prisma.publicAlert.findUnique({
      where: { id: params.id },
    });
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json(alert);
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
    const updated = await prisma.publicAlert.update({
      where: { id: params.id },
      data: {
        title: body.title,
        message: body.message,
        severity: body.severity,
        area: body.area,
        reason: body.reason,
        recommendedAction: body.recommendedAction,
        isPublished: body.isPublished !== undefined ? !!body.isPublished : undefined,
        validTo: body.validTo ? new Date(body.validTo) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_ALERT',
        userId: user.id,
        entityType: 'PublicAlert',
        entityId: updated.id,
        details: `Updated alert: ${updated.title} (Published: ${updated.isPublished})`,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const deleted = await prisma.publicAlert.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE_ALERT',
        userId: user.id,
        entityType: 'PublicAlert',
        entityId: params.id,
        details: `Deleted alert: ${deleted.title}`,
      },
    });

    return NextResponse.json({ success: true, message: 'Alert withdrawn' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
