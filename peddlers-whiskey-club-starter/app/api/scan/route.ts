import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ valid: false, reason: 'No token' }, { status: 400 });
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (!decoded?.id || !decoded?.exp) return NextResponse.json({ valid: false, reason: 'Bad token' }, { status: 400 });
    if (Date.now() > decoded.exp) return NextResponse.json({ valid: false, reason: 'Expired' }, { status: 400 });

    // For MVP we just validate. You can log a redemption here if you want:
    // await supabaseAdmin.from('redemptions').insert({ member_id: decoded.id, reward_code: 'mvp', meta: {} });

    return NextResponse.json({ valid: true, member_id: decoded.id });
  } catch (e: any) {
    return NextResponse.json({ valid: false, reason: e.message || 'Server error' }, { status: 500 });
  }
}