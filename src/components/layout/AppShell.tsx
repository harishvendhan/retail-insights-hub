import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Boxes,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic,
  Sparkles,
  Store,
  Truck,
  UserCog,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { changeLanguage, SUPPORTED_LANGUAGES } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/inventory", labelKey: "nav.inventory", icon: Boxes },
  { to: "/sales", labelKey: "nav.sales", icon: BarChart3 },
  { to: "/suppliers", labelKey: "nav.suppliers", icon: Truck },
  { to: "/import", labelKey: "nav.import", icon: FileSpreadsheet },
  { to: "/reports", labelKey: "nav.reports", icon: FileText },
  { to: "/ai-chat", labelKey: "nav.aiChat", icon: Sparkles },
  { to: "/voice", labelKey: "nav.voice", icon: Mic },
  { to: "/settings/profile", labelKey: "nav.profile", icon: UserCog },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Store className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">{t("app.name")}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {user?.storeName ?? "—"}
            </p>
          </div>
        </div>
        {nav}
        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
              <p className="text-sm font-semibold text-sidebar-foreground">{t("app.name")}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("common.close")}>
                <X className="size-5 text-sidebar-foreground" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label={t("nav.dashboard")}
          >
            <Menu className="size-5" />
          </Button>
          <p className="truncate text-sm font-medium">{user?.storeName ?? t("app.name")}</p>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-lg border bg-card p-0.5" role="group" aria-label={t("nav.language")}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    i18n.language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={() => void logout()} aria-label={t("nav.logout")}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        {api.usingMocks ? (
          <div className="border-b border-warning/40 bg-warning-soft px-4 py-2 text-center text-xs font-medium text-warning-foreground lg:px-8">
            {t("app.mockBanner")}
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
