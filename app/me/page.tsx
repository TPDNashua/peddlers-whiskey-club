'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function generateQrPayload(id: string) {
  const expiresAt = Date.now() + 1000 * 60 * 3; // 3 minutes
  const token = btoa(JSON.stringify({ id, exp: expiresAt }));
  return token;
}

export default function MePage() {
  const [identifier, setIdentifier] = useState('');
  const [member, setMember] = useState<any>(null);
  const [points, setPoints] = useState<number>(0);
  const [qr, setQr] = useState<string>('');

  async function load() {
    if (!identifier) return;
    const id = identifier.trim().toLowerCase();
    const { data: m, error } = await supabase.from('members').select('*').eq('id', id).single();
    if (error || !m) { setMember(null); setPoints(0); return; }
    setMember(m);
    const { data: pours } = await supabase.from('pours').select('points').eq('member_id', id);
    const total = (pours || []).reduce((a, b) => a + (b.points || 0), 0);
    setPoints(total);
  }

  useEffect(() => { if (identifier) load(); }, [identifier]);

  function makeQr() {
    if (!member) return;
    const token = generateQrPayload(member.id);
    setQr(token);
  }

  return (
    <main className="container">
      <div className="card">
        <h1>My Points</h1>
        <input placeholder="Enter your phone or email" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        {member && <>
          <p><b>{member.name}</b></p>
          <p>Total points: <b>{points}</b></p>
          <button onClick={makeQr}>Generate Redemption QR</button>
          {qr && (
            <div className="card">
              <p>Show this to staff within 3 minutes.</p>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qr)}`} alt="QR" />
            </div>
          )}
        </>}
      </div>
    </main>
  );
}