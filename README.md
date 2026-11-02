# QuizBuilder (React + Vite)

A quiz builder for education, training or trivia, built with **React + Vite**. All data lives in the
browser's `localStorage`, so there is no backend.

## 1. Problem statement

Teachers, trainers and quiz hosts need a fast way to write a quiz, share it and see how people did,
without standing up a server or paying for a SaaS tool. QuizBuilder lets an **admin** author quizzes
(multiple-choice, true/false and open-ended questions, with optional randomized order) and lets any
**signed-up user** browse them, take them one question at a time, and see their score next to a leaderboard.

## 2. Modules

| Module | Route | Who uses it | What it does |
|---|---|---|---|
| Admin | `/admin` | Seeded admin account | Create, edit, delete quizzes; add MCQ, True/False and Open-ended questions; set difficulty, category and fixed or random order; per-quiz reports (attempts, average, top score, leaderboard). |
| User | `/user` | Anyone who signs up | Browse quizzes, take one in focus mode with a progress bar, see score and leaderboard, review personal results. |
| Auth | `/` | Everyone | Sign up (creates a "user" account) and log in, backed by `localStorage`. |

Demo admin (seeded on first run): username `admin`, password `admin123`.

## 3. Review 2 checklist

- React + Vite project: yes (`npm run dev`, `npm run build`)
- Admin and User modules: `src/pages/AdminPage.jsx`, `src/pages/UserPage.jsx`
- Login and signup with Local Storage: `src/lib/storage.js`, `src/context/AuthContext.jsx`, `src/pages/AuthPage.jsx`
- Role-based route protection: `src/components/ProtectedRoute.jsx`
- Vercel deployment: `vercel.json` rewrites all routes to `index.html` so refreshing `/admin` or `/user` works

## 4. React basics used

| Concept | Where |
|---|---|
| Components and JSX | `QuizCard`, `Topbar`, `Leaderboard`, `QuestionEditor` |
| Props | `<QuizCard quiz={q}>`, `<QuestionEditor question onChange onRemove>` |
| State (`useState`) | active tab, form fields, current question, answers |
| `useMemo` | shuffle questions once per attempt (`QuizTaker`) |
| Context API + `useContext` | `AuthContext` (user, login, signup, logout), `ToastContext` |
| React Router | `/`, `/admin`, `/user` in `App.jsx`, `Navigate`, `useNavigate` |
| Controlled inputs | every form field uses `value` + `onChange` |
| Conditional rendering and lists | `{view === 'builder' && ...}`, `quizzes.map(...)` with `key` |
| `key` to reset state | `<QuizBuilder key={editing?.id || 'new'} />` |

## 5. Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "QuizBuilder: React + Vite, admin and user modules, localStorage auth"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 7. Deploy on Vercel

1. Go to vercel.com, sign in with GitHub, click **Add New > Project**, and import the repo.
2. Vercel detects **Vite** automatically (Build command `npm run build`, Output directory `dist`).
3. Click **Deploy**. Put the resulting URL in the repo's About section for the review.
4. Test on the live link: sign up as a user, log in as `admin`, publish a quiz, take it, and check Reports.

## Project structure

```
src/
  main.jsx            entry: providers + seed data
  App.jsx             routes
  styles.css          design system
  lib/storage.js      localStorage layer + grading
  context/            AuthContext, ToastContext
  components/         Topbar, QuizBuilder, QuestionEditor, QuizTaker, ScoreScreen, Reports, ...
  pages/              AuthPage, AdminPage, UserPage
```

## Limitations

- Data is per browser and does not sync across devices.
- Passwords are stored in plain text in `localStorage`. This is for demo use only.
- Open-ended grading is a keyword-match check, not real NLP.
