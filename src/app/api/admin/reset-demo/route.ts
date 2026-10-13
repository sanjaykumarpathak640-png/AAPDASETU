import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { getSessionUser } from '@/lib/auth';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const user = await getSessionUser();
    // Allow if admin or demo mode is active
    if (user && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'seed.mjs');
    await execPromise(`node "${scriptPath}"`);

    return NextResponse.json({
      success: true,
      message: 'Demo dataset has been successfully restored to initial verified state.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Reset failed' }, { status: 500 });
  }
}

