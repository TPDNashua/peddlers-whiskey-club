import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * POST: create bottle
 * PUT: update bottle
 * DELETE: delete bottle
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, label, region, style, points_per_pour } = body || {};
    if (!sku || !label) return NextResponse.json({ error: 'sku and label required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('bottles').insert({
      sku, label, region, style, points_per_pour: points_per_pour ?? 1
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, ...updates } = body || {};
    if (!sku) return NextResponse.json({ error: 'sku required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('bottles').update(updates).eq('sku', sku);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku } = body || {};
    if (!sku) return NextResponse.json({ error: 'sku required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('bottles').delete().eq('sku', sku);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}