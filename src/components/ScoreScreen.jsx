import Leaderboard from './Leaderboard.jsx';

export default function ScoreScreen({ quiz, result, onBack }) {
  const pct = Math.round((result.score / result.total) * 100);
  return (
    <div className="focus-shell">
      <div className="focus-inner center">
        <div className="q-count">Quiz complete</div>
        <h2>{quiz.title}</h2>
        <div className="score-ring">{pct}%</div>
        <p>You got {result.score} of {result.total} correct.</p>
        <h3 className="left">Leaderboard</h3>
        <Leaderboard quizId={quiz.id} highlightId={result.id} />
        <div className="focus-nav center-nav">
          <button className="btn" onClick={onBack}>Back to dashboard</button>
        </div>
      </div>
    </div>
  );
}
