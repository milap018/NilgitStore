import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logoutUser, signinUser, signupUser } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await checkSession();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function signup(form) {
    const data = await signupUser(form);
    setUser(data.user);
    return data.user;
  }

  async function signin(form) {
    const data = await signinUser(form);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAdmin: Boolean(user?.isAdmin),
    signup,
    signin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
