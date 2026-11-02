import { useState } from 'react';
import { getResults } from '../lib/storage.js';
import Leaderboard from './Leaderboard.jsx';

export default function Reports({ quizzes }) {
  const [quizId, setQuizId] = useState(quizzes[0]?.id || '');

  if (quizzes.length === 0) {
    return (
      <section className="view">
        <h1>Reports</h1>
        <p className="helper">Publish a quiz first, then its attempts show up here.</p>
      </section>
    );
  }

  const results = getResults().filter((r) => r.quizId === quizId);
  const pct = (r) => Math.round((r.score / r.total) * 100);
  const average = results.length ? Math.round(results.reduce((s, r) => s + pct(r), 0) / results.length) : 0;
  const top = results.length ? Math.max(...results.map(pct)) : 0;

  return (
    <section className="view">
      <h1>Reports</h1>
      <p>Pick a quiz to see who has taken it and how they scored.</p>

      <label htmlFor="report-select">Quiz</label>
      <select id="report-select" value={quizId} onChange={(e) => setQuizId(e.target.value)}>
        {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
      </select>

      <div className="stat-row">
        <div className="stat"><b>{results.length}</b><span>Attempts</span></div>
        <div className="stat"><b>{average}%</b><span>Average score</span></div>
        <div className="stat"><b>{top}%</b><span>Top score</span></div>
      </div>

      <h3>Leaderboard</h3>
      <Leaderboard quizId={quizId} />
    </section>
  );
}
