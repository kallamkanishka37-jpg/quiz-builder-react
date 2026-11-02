import { createContext, useContext, useState } from 'react';
import * as store from '../lib/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy initial state: read the saved session once on first render
  const [user, setUser] = useState(() => store.getSessionUser());

  const login = (username, password) => {
    const res = store.login(username, password);
    if (res.ok) setUser(res.user);
    return res;
  };

  const signup = (data) => {
    const res = store.signup(data);
    if (res.ok) setUser(res.user);
    return res;
  };

  const logout = () => {
    store.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
