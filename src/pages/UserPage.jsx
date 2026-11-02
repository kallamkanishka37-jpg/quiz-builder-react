import { useState } from 'react';
import Topbar from '../components/Topbar.jsx';
import QuizCard from '../components/QuizCard.jsx';
import QuizTaker from '../components/QuizTaker.jsx';
import ScoreScreen from '../components/ScoreScreen.jsx';
import { getQuizzes, getResults } from '../lib/storage.js';
import { useAuth } from '../context/AuthContext.jsx';

const TABS = [
  { id: 'browse', label: 'Browse quizzes' },
  { id: 'results', label: 'My results' },
];

export default function UserPage() {
  const { user } = useAuth();
  const [view, setView] = useState('browse');
  const [taking, setTaking] = useState(null); // quiz being attempted
  const [finished, setFinished] = useState(null); // { quiz, result }

  const quizzes = getQuizzes();

  if (taking) {
    return (
      <QuizTaker
        quiz={taking}
        onExit={() => setTaking(null)}
        onFinish={(result) => {
          setFinished({ quiz: taking, result });
          setTaking(null);
        }}
      />
    );
  }

  if (finished) {
    return <ScoreScreen quiz={finished.quiz} result={finished.result} onBack={() => setFinished(null)} />;
  }

  const myResults = getResults()
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="app-shell">
      <Topbar home="/user" tabs={TABS} active={view} onChange={setView} />
      <main className="main">
        {view === 'browse' && (
          <section className="view">
            <h1>Quizzes to try</h1>
            <p>Pick a quiz below. Your score is saved to the leaderboard as soon as you finish.</p>
            {quizzes.length === 0 ? (
              <p className="helper">No quizzes are published yet. Check back after the admin adds one.</p>
            ) : (
              <div className="card-grid">
                {quizzes.map((q) => (
                  <QuizCard key={q.id} quiz={q}>
                    <button className="btn small" disabled={q.questions.length === 0} onClick={() => setTaking(q)}>
                      Start quiz
                    </button>
                  </QuizCard>
                ))}
              </div>
            )}
          </section>
        )}

        {view === 'results' && (
          <section className="view">
            <h1>Your results</h1>
            {myResults.length === 0 ? (
              <p className="helper">You haven't taken a quiz yet. Start one from "Browse quizzes".</p>
            ) : (
              <table className="leaderboard">
                <thead>
                  <tr><th>Quiz</th><th>Score</th><th>Percent</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {myResults.map((r) => (
                    <tr key={r.id}>
                      <td>{r.quizTitle}</td>
                      <td>{r.score}/{r.total}</td>
                      <td>{Math.round((r.score / r.total) * 100)}%</td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
