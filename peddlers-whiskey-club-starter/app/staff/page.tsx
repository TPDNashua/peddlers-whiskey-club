'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const PIN = process.env.NEXT_PUBLIC_STAFF_PIN || '';

export default function StaffPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [query, setQuery] = useState('');
  const [member, setMember] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  useEffect(() => {
    // simple gate; production should use proper auth
  }, []);

  async function searchMember() {
    setStatus('Searching...');
    const id = query.trim().toLowerCase();
    const { data, error } = await supabase.from('members').select('*').or(`id.eq.${id},email.eq.${id},phone.eq.${id}`).limit(1).single();
    if (error || !data) { setMember(null); setStatus('No match.'); return; }
    setMember(data); setStatus(null);
    const { data: pours } = await supabase.from('pours').select('points').eq('member_id', data.id);
    const total = (pours || []).reduce((a, b) => a + (b.points || 0), 0);
    setPointsAwarded(total);
  }

  async function award(points: number, reason: string) {
    if (!member) return;
    setStatus('Awarding...');
    const res = await fetch('/api/award', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ member_id: member.id, points, reason })
    });
    const j = await res.json();
    if (!res.ok) return setStatus('Error: ' + j.error);
    setStatus('OK');
    await searchMember();
  }

  return (
    <main className="container">
      {!authorized ? (
        <div className="card">
          <h1>Staff Access</h1>
          <input placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} />
          <button onClick={() => setAuthorized(pin === (process.env.NEXT_PUBLIC_STAFF_PIN || '1234'))}>Enter</button>
          <p style={{fontSize:12, opacity:0.7}}>For production, use proper staff auth. This is just an MVP gate.</p>
        </div>
      ) : (
        <div className="card">
          <h2>Award / Redeem</h2>
          <div className="grid3">
            <input placeholder="Search by phone/email" value={query} onChange={e => setQuery(e.target.value)} />
            <button onClick={searchMember}>Search</button>
            <button onClick={() => { setMember(null); setQuery(''); }}>Clear</button>
          </div>
          {member && (
            <div className="card">
              <p><b>{member.name}</b> — {member.email || member.phone}</p>
              <p>Current points: <b>{pointsAwarded}</b></p>
              <div className="grid3">
                <button onClick={() => award(1, 'neat_pour')}>+1 Pour</button>
                <button onClick={() => award(2, 'flight')}>+2 Flight</button>
                <button onClick={() => award(1, 'new_bottle_bonus')}>+1 New Bottle</button>
              </div>
            </div>
          )}
          {status && <p>{status}</p>}
        </div>
      )}
    </main>
  );
}