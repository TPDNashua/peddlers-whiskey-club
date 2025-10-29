import './globals.css';
import React from 'react';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Whiskey Club',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <a href="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 20 }}>
              {process.env.NEXT_PUBLIC_SITE_NAME || 'Whiskey Club'}
            </a>
            <nav style={{ display: 'flex', gap: 12 }}>
              <a href="/join">Join</a>
              <a href="/me">My Points</a>
              <a href="/staff">Staff</a>
            </nav>
          </header>
          {children}
          <footer style={{ marginTop: 64, fontSize: 12, opacity: 0.7 }}>
            © {new Date().getFullYear()} Peddler’s Daughter — Whiskey Club
          </footer>
        </div>
      </body>
    </html>
  );
}