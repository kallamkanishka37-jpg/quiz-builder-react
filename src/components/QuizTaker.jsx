import { useMemo, useState } from 'react';
import { addResult, isCorrect } from '../lib/storage.js';
import { useAuth } from '../context/AuthContext.jsx';

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Focus mode: one question at a time with a progress bar
export default function QuizTaker({ quiz, onExit, onFinish }) {
  const { user } = useAuth();
  // useMemo so the shuffled order is picked once per attempt, not on every render
  const questions = useMemo(() => (quiz.randomize ? shuffle(quiz.questions) : quiz.questions), [quiz]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const setAnswer = (value) => setAnswers((a) => ({ ...a, [q.id]: value }));

  const next = () => {
    if (!isLast) return setIndex(index + 1);
    const score = questions.filter((x) => isCorrect(x, answers[x.id])).length;
    const result = addResult({
      quizId: quiz.id, quizTitle: quiz.title, userId: user.id, userName: user.name,
      score, total: questions.length,
    });
    onFinish(result);
  };

  return (
    <div className="focus-shell">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: (index / questions.length) * 100 + '%' }} />
      </div>
      <div className="focus-inner">
        <div className="q-count">Question {index + 1} of {questions.length}</div>
        <h2>{q.text}</h2>

        <div className="answer-area">
          {q.type === 'mcq' &&
            q.options.map((opt, i) =>
              opt.trim() ? (
                <button key={i} className={'option' + (answers[q.id] === i ? ' selected' : '')} onClick={() => setAnswer(i)}>
                  {opt}
                </button>
              ) : null
            )}
          {q.type === 'tf' &&
            ['true', 'false'].map((v) => (
              <button key={v} className={'option' + (answers[q.id] === v ? ' selected' : '')} onClick={() => setAnswer(v)}>
                {v === 'true' ? 'True' : 'False'}
              </button>
            ))}
          {q.type === 'open' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer"
            />
          )}
        </div>

        <div className="focus-nav">
          <button className="btn secondary" onClick={onExit}>Exit quiz</button>
          <button className="btn" onClick={next}>{isLast ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}
