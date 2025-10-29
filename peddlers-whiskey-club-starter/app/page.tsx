export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Welcome to the Whiskey Club</h1>
        <p>Earn points for whiskey pours and flights. Unlock badges. Redeem for perks and experiences.</p>
        <p>
          <a href="/join"><button>Join the Club</button></a>
          <span style={{ marginLeft: 12 }} />
          <a href="/me"><button>View My Points</button></a>
        </p>
      </div>
      <div className="card">
        <h3>How it works</h3>
        <ol>
          <li>Join with your name and phone or email.</li>
          <li>Show your member QR or give your name to staff when you order.</li>
          <li>Collect points and redeem perks.</li>
        </ol>
      </div>
    </main>
  );
}