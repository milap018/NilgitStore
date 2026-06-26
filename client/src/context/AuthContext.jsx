import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logoutUser, signinUser, signupUser } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// On first app load, ask the backend whether the cookie session is still valid.
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

// Signup returns a user and also sets the cookie session on the backend.
  async function signup(form) {
    const data = await signupUser(form);
    setUser(data.user);
    return data.user;
  }

// Signin works the same way: backend validates credentials, then returns the user.
  async function signin(form) {
    const data = await signinUser(form);
    setUser(data.user);
    return data.user;
  }

// Logging out clears the cookie server-side, then we clear local auth state.
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
