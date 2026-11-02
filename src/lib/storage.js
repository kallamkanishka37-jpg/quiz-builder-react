// Shared localStorage layer: users, quizzes, results, session.
const KEYS = {
  users: 'qb_users',
  quizzes: 'qb_quizzes',
  results: 'qb_results',
  session: 'qb_session',
};

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- seed ---------- */
export function seedData() {
  const users = read(KEYS.users, []);
  if (!users.some((u) => u.username === 'admin')) {
    users.push({ id: uid(), name: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' });
    write(KEYS.users, users);
  }
  if (localStorage.getItem(KEYS.quizzes) === null) {
    write(KEYS.quizzes, [
      {
        id: uid(),
        title: 'React Basics',
        category: 'Web Development',
        description: 'Check the core ideas behind React: components, props, state and hooks.',
        difficulty: 'easy',
        randomize: true,
        createdAt: new Date().toISOString(),
        questions: [
          {
            id: uid(), type: 'mcq', text: 'Which hook adds state to a function component?',
            options: ['useEffect', 'useState', 'useRef', 'useMemo'], correct: 1,
          },
          {
            id: uid(), type: 'mcq', text: 'How does a parent component pass data to a child?',
            options: ['Props', 'Cookies', 'Refs only', 'CSS variables'], correct: 0,
          },
          { id: uid(), type: 'tf', text: 'Vite is a build tool and dev server.', correct: 'true' },
          {
            id: uid(), type: 'open', text: 'In one sentence, what does JSX do?',
            keywords: 'html, syntax, javascript, markup, elements',
          },
        ],
      },
    ]);
  }
}

/* ---------- auth ---------- */
export function signup({ name, username, password }) {
  const users = read(KEYS.users, []);
  const clean = username.trim();
  if (users.some((u) => u.username.toLowerCase() === clean.toLowerCase())) {
    return { ok: false, error: 'That username is taken. Try another one.' };
  }
  const user = { id: uid(), name: name.trim(), username: clean, password, role: 'user' };
  write(KEYS.users, [...users, user]);
  write(KEYS.session, user.id);
  return { ok: true, user };
}

export function login(username, password) {
  const users = read(KEYS.users, []);
  const user = users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: 'Wrong username or password.' };
  write(KEYS.session, user.id);
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(KEYS.session);
}

export function getSessionUser() {
  const id = read(KEYS.session, null);
  if (!id) return null;
  return read(KEYS.users, []).find((u) => u.id === id) || null;
}

/* ---------- quizzes ---------- */
export const getQuizzes = () => read(KEYS.quizzes, []);

export function saveQuiz(quiz) {
  const quizzes = getQuizzes();
  const exists = quizzes.some((q) => q.id === quiz.id);
  const next = exists
    ? quizzes.map((q) => (q.id === quiz.id ? quiz : q))
    : [...quizzes, { ...quiz, id: uid(), createdAt: new Date().toISOString() }];
  write(KEYS.quizzes, next);
  return next;
}

export function deleteQuiz(id) {
  const next = getQuizzes().filter((q) => q.id !== id);
  write(KEYS.quizzes, next);
  return next;
}

/* ---------- results ---------- */
export const getResults = () => read(KEYS.results, []);

export function addResult(result) {
  const entry = { ...result, id: uid(), date: new Date().toISOString() };
  write(KEYS.results, [...getResults(), entry]);
  return entry;
}

/* ---------- grading ---------- */
// MCQ: option index. True/False: 'true' | 'false'.
// Open-ended: correct when at least half of the keywords appear in the answer.
export function isCorrect(question, answer) {
  if (answer === undefined || answer === null || answer === '') return false;
  if (question.type === 'mcq') return answer === question.correct;
  if (question.type === 'tf') return answer === question.correct;
  const keywords = (question.keywords || '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  if (keywords.length === 0) return String(answer).trim().length > 0;
  const text = String(answer).toLowerCase();
  const hits = keywords.filter((k) => text.includes(k)).length;
  return hits / keywords.length >= 0.5;
}
