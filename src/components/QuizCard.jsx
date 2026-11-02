export default function QuizCard({ quiz, children }) {
  return (
    <article className="card">
      <div className="card-tags">
        <span className="badge">{quiz.category}</span>
        <span className={'badge diff-' + quiz.difficulty}>{quiz.difficulty}</span>
      </div>
      <h3>{quiz.title}</h3>
      <p>{quiz.description || 'No description.'}</p>
      <p className="helper">{quiz.questions.length} questions{quiz.randomize ? ', shuffled' : ''}</p>
      <div className="btn-row tight">{children}</div>
    </article>
  );
}
