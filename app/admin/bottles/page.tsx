'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Bottle = {
  sku: string;
  label: string;
  region: string | null;
  style: string | null;
  points_per_pour: number | null;
};

export default function BottlesAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  // form state
  const [sku, setSku] = useState('');
  const [label, setLabel] = useState('');
  const [region, setRegion] = useState('');
  const [style, setStyle] = useState('');
  const [points, setPoints] = useState(1);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('bottles').select('*').order('label');
    if (error) setStatus('Error loading: ' + error.message);
    setBottles(data || []);
    setLoading(false);
  }

  useEffect(() => { if (authorized) load(); }, [authorized]);

  async function addBottle(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Adding...');
    const res = await fetch('/api/bottles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: sku.trim(),
        label: label.trim(),
        region: region.trim() || null,
        style: style.trim() || null,
        points_per_pour: Number(points) || 1
      })
    });
    const j = await res.json();
    if (!res.ok) { setStatus('Error: ' + j.error); return; }
    setStatus('Added.');
    setSku(''); setLabel(''); setRegion(''); setStyle(''); setPoints(1);
    await load();
  }

  async function deleteBottle(sku: string) {
    if (!confirm(`Delete ${sku}?`)) return;
    setStatus('Deleting...');
    const res = await fetch('/api/bottles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku })
    });
    const j = await res.json();
    if (!res.ok) { setStatus('Error: ' + j.error); return; }
    setStatus('Deleted.');
    await load();
  }

  return (
    <main className="container">
      {!authorized ? (
        <div className="card">
          <h1>Bottles Admin</h1>
          <p>Enter staff PIN to continue.</p>
          <input placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} />
          <button onClick={() => setAuthorized(pin === (process.env.NEXT_PUBLIC_STAFF_PIN || '1234'))}>Enter</button>
          <p style={{fontSize:12, opacity:0.7}}>For production, replace PIN gate with real staff auth.</p>
        </div>
      ) : (
        <div className="container">
          <div className="card">
            <h2>Add a Whiskey</h2>
            <form onSubmit={addBottle} className="grid3">
              <input required placeholder="SKU (unique id)" value={sku} onChange={e => setSku(e.target.value)} />
              <input required placeholder="Label (e.g., Redbreast 12)" value={label} onChange={e => setLabel(e.target.value)} />
              <input placeholder="Region (e.g., Ireland, Islay)" value={region} onChange={e => setRegion(e.target.value)} />
              <input placeholder="Style (irish, scotch, bourbon, rye, japanese...)" value={style} onChange={e => setStyle(e.target.value)} />
              <input type="number" min={0} placeholder="Points per pour" value={points} onChange={e => setPoints(Number(e.target.value))} />
              <button type="submit">Add</button>
            </form>
            {status && <p>{status}</p>}
          </div>

          <div className="card">
            <h2>Whiskey List</h2>
            {loading ? <p>Loading...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Label</th>
                    <th>Region</th>
                    <th>Style</th>
                    <th>Pts/Pour</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bottles.map(b => (
                    <tr key={b.sku}>
                      <td>{b.sku}</td>
                      <td>{b.label}</td>
                      <td>{b.region}</td>
                      <td>{b.style}</td>
                      <td>{b.points_per_pour ?? 1}</td>
                      <td><button onClick={() => deleteBottle(b.sku)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
