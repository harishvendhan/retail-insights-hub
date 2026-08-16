import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import "@/i18n";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your store account — SuperIntel" },
      { name: "description", content: "Create a supermarket account to track sales, inventory and AI insights." },
      { property: "og:title", content: "Create your store account — SuperIntel" },
      { property: "og:description", content: "Create a supermarket account to track sales, inventory and AI insights." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", storeName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name) next['name'] = t("auth.required");
    if (!form.storeName) next['storeName'] = t("auth.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next['email'] = t("auth.invalidEmail");
    if (form.password.length < 6) next['password'] = t("auth.passwordShort");
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      await signup(form);
      toast.success(t("auth.loginSuccess"));
      void navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.loginFailed"));
    } finally {
      setPending(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; type: string }[] = [
    { key: "name", label: t("auth.name"), type: "text" },
    { key: "storeName", label: t("auth.storeName"), type: "text" },
    { key: "email", label: t("auth.email"), type: "email" },
    { key: "password", label: t("auth.password"), type: "password" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-card">
        <h1 className="text-xl font-semibold">{t("auth.signupTitle")}</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input id={f.key} type={f.type} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              {errors[f.key] ? <p className="text-xs text-danger">{errors[f.key]}</p> : null}
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t("auth.signup")}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">{t("auth.login")}</Link>
        </p>
      </div>
    </div>
  );
}
