import { useState } from 'react';
import Topbar from '../components/Topbar.jsx';
import QuizCard from '../components/QuizCard.jsx';
import QuizBuilder from '../components/QuizBuilder.jsx';
import Reports from '../components/Reports.jsx';
import { getQuizzes, deleteQuiz } from '../lib/storage.js';
import { useToast } from '../context/ToastContext.jsx';

const TABS = [
  { id: 'quizzes', label: 'My quizzes' },
  { id: 'builder', label: 'Create quiz' },
  { id: 'reports', label: 'Reports' },
];

export default function AdminPage() {
  const toast = useToast();
  const [view, setView] = useState('quizzes');
  const [quizzes, setQuizzes] = useState(getQuizzes);
  const [editing, setEditing] = useState(null);

  const goTo = (id) => {
    setEditing(null); // leaving the builder tab always clears edit mode
    setView(id);
  };

  const edit = (quiz) => {
    setEditing(quiz);
    setView('builder');
  };

  const remove = (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) return;
    setQuizzes(deleteQuiz(quiz.id));
    toast('Quiz deleted');
  };

  const afterSave = () => {
    setQuizzes(getQuizzes());
    goTo('quizzes');
  };

  return (
    <div className="app-shell">
      <Topbar home="/admin" label="admin" tabs={TABS} active={view} onChange={goTo} />
      <main className="main">
        {view === 'quizzes' && (
          <section className="view">
            <h1>Your quizzes</h1>
            <p>Every quiz you publish here becomes available to signed-in users right away.</p>
            {quizzes.length === 0 ? (
              <p className="helper">Nothing published yet. Open "Create quiz" to write your first one.</p>
            ) : (
              <div className="card-grid">
                {quizzes.map((q) => (
                  <QuizCard key={q.id} quiz={q}>
                    <button className="btn secondary small" onClick={() => edit(q)}>Edit</button>
                    <button className="btn danger small" onClick={() => remove(q)}>Delete</button>
                  </QuizCard>
                ))}
              </div>
            )}
          </section>
        )}

        {view === 'builder' && (
          // key resets the form's state when we switch between "new" and "edit"
          <QuizBuilder key={editing?.id || 'new'} quiz={editing} onDone={afterSave} onCancel={() => goTo('quizzes')} />
        )}

        {view === 'reports' && <Reports quizzes={quizzes} />}
      </main>
    </div>
  );
}
