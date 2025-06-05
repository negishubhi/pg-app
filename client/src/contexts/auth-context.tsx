import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, getCurrentUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, role: "admin" | "tenant") => Promise<void>;
  signUp: (email: string, password: string, name: string, role: "admin" | "tenant") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, role: "admin" | "tenant") => {
    const { signIn: authSignIn } = await import("@/lib/auth");
    const authUser = await authSignIn(email, password, role);
    setUser(authUser);
  };

  const signUp = async (email: string, password: string, name: string, role: "admin" | "tenant") => {
    const { signUp: authSignUp } = await import("@/lib/auth");
    const authUser = await authSignUp(email, password, name, role);
    setUser(authUser);
  };

  const signOut = async () => {
    const { signOut: authSignOut } = await import("@/lib/auth");
    await authSignOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
