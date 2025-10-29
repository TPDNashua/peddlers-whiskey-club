'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Working...');
    const id = (phone || email).trim().toLowerCase();
    if (!id) return setStatus('Please provide phone or email.');

    // Upsert member
    const { data, error } = await supabase
      .from('members')
      .upsert({ id, name, email: email || null, phone: phone || null }, { onConflict: 'id' })
      .select()
      .single();
    if (error) return setStatus('Error: ' + error.message);
    setStatus('Welcome! You can now view your points on the My Points page.');
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Join the Whiskey Club</h1>
        <form onSubmit={handleJoin} className="container">
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          <input placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Mobile phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <button type="submit">Join</button>
        </form>
        {status && <p>{status}</p>}
      </div>
    </main>
  );
}