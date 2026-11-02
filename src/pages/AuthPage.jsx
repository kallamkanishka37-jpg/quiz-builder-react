import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AboutPanel from '../components/AboutPanel.jsx';

export default function AuthPage() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', username: '', password: '' });

  // Already signed in? Go straight to the right dashboard.
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const switchMode = (m) => {
    setMode(m);
    setError('');
  };

  const submit = (e) => {
    e.preventDefault();
    const res = mode === 'login' ? login(form.username, form.password) : signup(form);
    if (!res.ok) return setError(res.error);
    navigate(res.user.role === 'admin' ? '/admin' : '/user');
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="logo">Quiz<span>Builder</span></h1>
        <p>Sign in to build, share and take quizzes.</p>

        <div className="auth-tabs">
          <button type="button" className={'tab-link' + (mode === 'login' ? ' active' : '')} onClick={() => switchMode('login')}>Log in</button>
          <button type="button" className={'tab-link' + (mode === 'signup' ? ' active' : '')} onClick={() => switchMode('signup')}>Sign up</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <>
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" value={form.name} onChange={change('name')} required />
            </>
          )}

          <label htmlFor="username">{mode === 'login' ? 'Username' : 'Choose a username'}</label>
          <input id="username" type="text" autoComplete="username" value={form.username} onChange={change('username')} required />

          <label htmlFor="password">{mode === 'login' ? 'Password' : 'Choose a password'}</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={form.password}
            onChange={change('password')}
            minLength={mode === 'signup' ? 4 : undefined}
            required
          />

          {error && <div className="field-error">{error}</div>}

          <button type="submit" className="btn block">{mode === 'login' ? 'Log in' : 'Create account'}</button>
          <p className="helper center-text">
            {mode === 'login'
              ? <>Demo admin: username <code>admin</code>, password <code>admin123</code></>
              : 'New accounts join as quiz takers.'}
          </p>
        </form>
      </div>

      <AboutPanel />
    </div>
  );
}
