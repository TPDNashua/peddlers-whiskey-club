import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const payload = { id, exp: Date.now() + 1000 * 60 * 3 };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}