import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { api, authStorage } from "@/lib/api";
import type { AuthUser } from "@/types/api";

/** Session state comes from the auth API/token only — never hardcoded. */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setUser(authStorage.user);
    setReady(true);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      authStorage.save(res);
      setUser(res.user);
      return res.user;
    },
    [],
  );

  const signup = useCallback(
    async (payload: { name: string; storeName: string; email: string; password: string }) => {
      const res = await api.signup(payload);
      authStorage.save(res);
      setUser(res.user);
      return res.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    try {
      await api.logout();
    } catch {
      /* clear the local session regardless */
    }
    authStorage.clear();
    setUser(null);
    void navigate({ to: "/login", replace: true });
  }, [navigate, queryClient]);

  return { user, ready, isAuthenticated: !!user, login, signup, logout };
}
