import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Topbar({ home, label, tabs, active, onChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link className="brand" to={home}>
        Quiz<span>Builder</span>
        {label && <small>{label}</small>}
      </Link>
      <nav>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={'tab-link' + (active === t.id ? ' active' : '')}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="who">
        <span>{user.name}</span>
        <button className="btn secondary" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}
