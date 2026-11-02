// Project details from the README, shown on the sign-in page.
const MODULES = [
  {
    name: 'Admin module',
    who: 'The seeded admin account',
    text: 'Create, edit and delete quizzes. Add multiple-choice, true/false and open-ended questions, set difficulty and category, choose fixed or randomized order, and read per-quiz reports with attempts, average score, top score and a leaderboard.',
  },
  {
    name: 'User module',
    who: 'Anyone who signs up',
    text: 'Browse published quizzes, take one in a distraction-free screen with a progress bar, get an instant score with the leaderboard, and review your own results history.',
  },
  {
    name: 'Auth',
    who: 'Everyone',
    text: 'Sign up (creates a user account) and log in. Accounts and sessions are stored in localStorage, and routes check your role before opening a dashboard.',
  },
];

const REACT_BASICS = [
  ['Components', 'The UI is split into small functions that return JSX, such as QuizCard, Topbar and Leaderboard.'],
  ['Props', 'A parent passes data down to a child, e.g. <QuizCard quiz={quiz} />.'],
  ['State (useState)', 'Values that change over time, like the active tab, the form fields or the current question.'],
  ['Hooks (useMemo, useContext)', 'useMemo shuffles questions once per attempt; useContext shares the logged-in user across the app.'],
  ['Context API', 'AuthContext and ToastContext give every component access to login state and notifications without prop drilling.'],
  ['React Router', 'Routes /, /admin and /user, with a ProtectedRoute that redirects based on role.'],
  ['Controlled inputs', 'Every form field gets its value from state and updates it in onChange.'],
  ['Vite', 'The dev server and build tool: npm run dev to develop, npm run build to produce the dist folder that Vercel serves.'],
];

export default function AboutPanel() {
  return (
    <aside className="about">
      <h2>Why QuizBuilder</h2>
      <p>
        Teachers, trainers and quiz hosts need a fast way to write a quiz, share it and see how people did, without running a
        server or paying for a SaaS tool. An admin writes the quiz; any signed-up user can take it and see where they rank.
      </p>

      <h3>Modules</h3>
      <div className="module-list">
        {MODULES.map((m) => (
          <div className="module" key={m.name}>
            <strong>{m.name}</strong>
            <em>{m.who}</em>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <h3>React basics used in this project</h3>
      <dl className="basics">
        {REACT_BASICS.map(([term, text]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
