import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertOctagon, AlertTriangle, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionableInsight } from "@/types/api";

const TONE = {
  info: "border-brand/25 bg-brand-soft/50",
  warning: "border-warning/35 bg-warning-soft/60",
  critical: "border-danger/30 bg-danger-soft/60",
} as const;

const ICON = {
  info: Lightbulb,
  warning: AlertTriangle,
  critical: AlertOctagon,
} as const;

const ICON_TONE = {
  info: "text-brand",
  warning: "text-warning-foreground",
  critical: "text-danger",
} as const;

/** Renders a backend-generated insight string. Nothing is derived client-side. */
export function InsightCard({ insight }: { insight: ActionableInsight }) {
  const { t } = useTranslation();
  const Icon = ICON[insight.severity];

  const body = (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3.5", TONE[insight.severity])}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", ICON_TONE[insight.severity])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed">{insight.message}</p>
        {insight.isEstimate ? (
          <span className="mt-2 inline-block rounded-full bg-card/80 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {t("common.estimate")}
          </span>
        ) : null}
      </div>
      {insight.link ? <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> : null}
    </div>
  );

  if (!insight.link) return body;

  const [pathname, query] = insight.link.split("?");
  const search = Object.fromEntries(new URLSearchParams(query ?? "")) as Record<string, string>;

  return (
    <Link to={pathname ?? "/dashboard"} search={search} className="block transition-opacity hover:opacity-90">
      {body}
    </Link>
  );
}
