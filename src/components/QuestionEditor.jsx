const TYPE_LABEL = { mcq: 'Multiple choice', tf: 'True / False', open: 'Open-ended' };

// Controlled component: the parent owns the question, we call onChange / onRemove
export default function QuestionEditor({ index, question, onChange, onRemove }) {
  const set = (patch) => onChange({ ...question, ...patch });
  const setOption = (i, value) => {
    const options = question.options.map((o, k) => (k === i ? value : o));
    set({ options });
  };

  return (
    <div className="q-editor">
      <div className="q-editor-head">
        <strong>Question {index + 1}</strong>
        <span className="badge">{TYPE_LABEL[question.type]}</span>
        <button type="button" className="btn danger small" onClick={onRemove}>Remove</button>
      </div>

      <label>Question text</label>
      <input
        type="text"
        value={question.text}
        onChange={(e) => set({ text: e.target.value })}
        placeholder="Type the question"
      />

      {question.type === 'mcq' && (
        <>
          <label>Options (select the correct one)</label>
          {question.options.map((opt, i) => (
            <div className="opt-row" key={i}>
              <input
                type="radio"
                name={'correct-' + question.id}
                checked={question.correct === i}
                onChange={() => set({ correct: i })}
                aria-label={'Mark option ' + (i + 1) + ' as correct'}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={'Option ' + (i + 1)}
              />
            </div>
          ))}
        </>
      )}

      {question.type === 'tf' && (
        <>
          <label>Correct answer</label>
          <select value={question.correct} onChange={(e) => set({ correct: e.target.value })}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </>
      )}

      {question.type === 'open' && (
        <>
          <label>Keywords (comma separated)</label>
          <input
            type="text"
            value={question.keywords}
            onChange={(e) => set({ keywords: e.target.value })}
            placeholder="e.g. mitochondria, energy, atp"
          />
          <p className="helper">An answer counts as correct when it contains at least half of these words.</p>
        </>
      )}
    </div>
  );
}
