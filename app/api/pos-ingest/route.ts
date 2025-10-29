import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Future POS ingestion endpoint (SkyTab-friendly).
 * Expected JSON:
 * {
 *   "member_id": "string",            // phone/email id
 *   "receipt_id": "string",
 *   "items": [{ "sku":"WHISKEY_101", "qty":1, "price":12.00 }],
 *   "total": 24.00,
 *   "timestamp": "2025-10-29T00:00:00Z"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { member_id, items } = body || {};
    if (!member_id || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Whitelist whiskey SKUs from bottles table
    const { data: bottles } = await supabaseAdmin.from('bottles').select('sku, points_per_pour');
    const whitelist = new Map((bottles || []).map(b => [b.sku, b.points_per_pour || 1]));

    let points = 0;
    for (const it of items) {
      const ppp = whitelist.get(it.sku);
      if (ppp) points += (ppp * (it.qty || 1));
    }

    if (points > 0) {
      await supabaseAdmin.from('pours').insert({ member_id, points, reason: 'pos_auto' });
    }
    return NextResponse.json({ ok: true, points_awarded: points });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}