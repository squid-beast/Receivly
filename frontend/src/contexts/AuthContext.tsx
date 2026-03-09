/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "@/lib/api";

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  workspaceId: string;
  businessName: string;
  timezone?: string;
  onboardingCompleted: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signup: (data: {
    fullName: string;
    businessName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signin: (data: { email: string; password: string }) => Promise<void>;
  googleAuth: (credential: string) => Promise<void>;
  signout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "receivly-token";
const USER_KEY = "receivly-user";

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const loading = false;

  const persistAuth = useCallback((authToken: string, authUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  }, []);

  const signup = useCallback(
    async (data: {
      fullName: string;
      businessName: string;
      email: string;
      password: string;
    }) => {
      const res = await api.post("/auth/signup", data);
      const { token: authToken, ...authUser } = res.data;
      persistAuth(authToken, authUser);
    },
    [persistAuth]
  );

  const signin = useCallback(
    async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/signin", data);
      const { token: authToken, ...authUser } = res.data;
      persistAuth(authToken, authUser);
    },
    [persistAuth]
  );

  const googleAuth = useCallback(
    async (credential: string) => {
      const res = await api.post("/auth/google", { credential });
      const { token: authToken, ...authUser } = res.data;
      persistAuth(authToken, authUser);
    },
    [persistAuth]
  );

  const signout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, signin, googleAuth, signout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
