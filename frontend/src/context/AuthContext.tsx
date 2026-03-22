import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthUser, clearAuth, getSavedAuth, saveAuth } from '../storage/authStorage';

type LoginProfile = { userId?: number; username?: string };

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, profile?: LoginProfile) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedAuth().then((saved) => {
      setUser(saved);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string, profile?: LoginProfile) => {
    const trimmed = email.trim();
    if (!trimmed) return;

    const authUser: AuthUser = {
      email: trimmed,
      password,
      ...(profile?.userId != null && { userId: profile.userId }),
      ...(profile?.username != null && profile.username !== '' && { username: profile.username }),
    };

    await saveAuth(authUser);
    setUser(authUser);
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    if (user.password != null && user.password !== currentPassword) return false;
    if (newPassword.length < 6) return false;

    const updated: AuthUser = { ...user, password: newPassword };
    await saveAuth(updated);
    setUser(updated);
    return true;
  }, [user]);

  const logout = useCallback(async () => {
    await clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user != null,
        login,
        logout,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}