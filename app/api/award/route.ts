import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { member_id, points, reason } = await req.json();
    if (!member_id || !points) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data: member, error: mErr } = await supabaseAdmin.from('members').select('id').eq('id', member_id).single();
    if (mErr || !member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    const { error } = await supabaseAdmin.from('pours').insert({ member_id, points, reason });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}