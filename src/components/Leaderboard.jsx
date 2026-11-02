import { getResults } from '../lib/storage.js';

export default function Leaderboard({ quizId, highlightId }) {
  const rows = getResults()
    .filter((r) => r.quizId === quizId)
    .sort((a, b) => b.score / b.total - a.score / a.total || new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  if (rows.length === 0) return <p className="helper">No attempts yet. Be the first on the board.</p>;

  return (
    <table className="leaderboard">
      <thead>
        <tr><th>Rank</th><th>Name</th><th>Score</th><th>Date</th></tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id} className={r.id === highlightId ? 'me' : ''}>
            <td>{i + 1}</td>
            <td>{r.userName}</td>
            <td>{r.score}/{r.total}</td>
            <td>{new Date(r.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
