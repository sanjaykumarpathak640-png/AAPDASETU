export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.delete('aapdasetu_session');
  return res;
}

