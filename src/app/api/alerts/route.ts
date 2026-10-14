export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity');

    const where: any = { isPublished: true };
    if (severity) where.severity = severity;

    const alerts = await prisma.publicAlert.findMany({
      where,
      orderBy: { validFrom: 'desc' },
    });
    return NextResponse.json(alerts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required to create alerts' }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, severity, area, reason, recommendedAction, validTo, issuingAuthority } = body;

    if (!title || !message || !severity || !area) {
      return NextResponse.json({ error: 'Missing required alert fields' }, { status: 400 });
    }

    const alert = await prisma.publicAlert.create({
      data: {
        title,
        message,
        severity,
        area,
        reason: reason || 'Monsoon water elevation model',
        recommendedAction: recommendedAction || 'Follow official district guidelines',
        validFrom: new Date(),
        validTo: validTo ? new Date(validTo) : new Date(Date.now() + 86400000 * 2),
        issuingAuthority: issuingAuthority || 'State Disaster Management Authority (SDMA)',
        isPublished: true,
        isDemo: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_ALERT',
        userId: user.id,
        entityType: 'PublicAlert',
        entityId: alert.id,
        details: `Published ${alert.severity} alert for ${alert.area}`,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

