import { useState } from 'react';
import QuestionEditor from './QuestionEditor.jsx';
import { saveQuiz, uid } from '../lib/storage.js';
import { useToast } from '../context/ToastContext.jsx';

const blankQuestion = (type) => {
  const base = { id: uid(), type, text: '' };
  if (type === 'mcq') return { ...base, options: ['', '', '', ''], correct: 0 };
  if (type === 'tf') return { ...base, correct: 'true' };
  return { ...base, keywords: '' };
};

function validate(form) {
  if (!form.title.trim()) return 'Give the quiz a title.';
  if (form.questions.length === 0) return 'Add at least one question.';
  for (let i = 0; i < form.questions.length; i++) {
    const q = form.questions[i];
    const n = i + 1;
    if (!q.text.trim()) return `Question ${n} needs text.`;
    if (q.type === 'mcq' && q.options.filter((o) => o.trim()).length < 2)
      return `Question ${n} needs at least two options.`;
    if (q.type === 'mcq' && !q.options[q.correct].trim())
      return `Question ${n}: the option marked correct is empty.`;
  }
  return '';
}

export default function QuizBuilder({ quiz, onDone, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState(
    quiz || { title: '', category: '', description: '', difficulty: 'medium', randomize: false, questions: [] }
  );
  const [error, setError] = useState('');

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const addQuestion = (type) => update({ questions: [...form.questions, blankQuestion(type)] });
  const changeQuestion = (i, q) => update({ questions: form.questions.map((x, k) => (k === i ? q : x)) });
  const removeQuestion = (i) => update({ questions: form.questions.filter((_, k) => k !== i) });

  const handleSave = () => {
    const problem = validate(form);
    if (problem) return setError(problem);
    setError('');
    saveQuiz({ ...form, title: form.title.trim(), category: form.category.trim() || 'General' });
    toast(quiz ? 'Quiz updated' : 'Quiz published');
    onDone();
  };

  return (
    <section className="view">
      <h1>{quiz ? 'Edit quiz' : 'Create a quiz'}</h1>
      <p>Add as many questions as you need, mix question types, and decide whether the order shuffles for each attempt.</p>

      <div className="grid-2">
        <div>
          <label htmlFor="q-title">Quiz title</label>
          <input id="q-title" type="text" value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="e.g. Cell Biology Basics" />
        </div>
        <div>
          <label htmlFor="q-category">Category</label>
          <input id="q-category" type="text" value={form.category} onChange={(e) => update({ category: e.target.value })} placeholder="e.g. Biology" />
        </div>
      </div>

      <label htmlFor="q-description">Description</label>
      <textarea id="q-description" value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="What is this quiz about?" />

      <div className="grid-2">
        <div>
          <label htmlFor="q-difficulty">Difficulty</label>
          <select id="q-difficulty" value={form.difficulty} onChange={(e) => update({ difficulty: e.target.value })}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="q-randomize">Question order</label>
          <select id="q-randomize" value={String(form.randomize)} onChange={(e) => update({ randomize: e.target.value === 'true' })}>
            <option value="false">Fixed order</option>
            <option value="true">Randomize for each attempt</option>
          </select>
        </div>
      </div>

      <h2 className="section-title">Questions</h2>
      {form.questions.length === 0 && <p className="helper">No questions yet. Add one with the buttons below.</p>}
      {form.questions.map((q, i) => (
        <QuestionEditor key={q.id} index={i} question={q} onChange={(nq) => changeQuestion(i, nq)} onRemove={() => removeQuestion(i)} />
      ))}

      <div className="btn-row">
        <button className="btn secondary" onClick={() => addQuestion('mcq')}>+ Multiple choice</button>
        <button className="btn secondary" onClick={() => addQuestion('tf')}>+ True / False</button>
        <button className="btn secondary" onClick={() => addQuestion('open')}>+ Open-ended</button>
      </div>

      {error && <div className="field-error">{error}</div>}

      <div className="btn-row">
        <button className="btn" onClick={handleSave}>{quiz ? 'Save changes' : 'Publish quiz'}</button>
        {quiz && <button className="btn secondary" onClick={onCancel}>Cancel edit</button>}
      </div>
    </section>
  );
}
