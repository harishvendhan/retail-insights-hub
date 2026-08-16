import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/format";
import type { MetricValue } from "@/types/api";

type Tone = "default" | "success" | "warning" | "danger" | "expiring" | "brand";

const TONE_ACCENT: Record<Tone, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning-foreground",
  danger: "text-danger",
  expiring: "text-expiring",
  brand: "text-brand",
};

export function StatCard({
  label,
  metric,
  currency = "INR",
  icon,
  tone = "default",
  isEstimate,
  footer,
  className,
}: {
  label: string;
  metric: MetricValue;
  currency?: string;
  icon?: ReactNode;
  tone?: Tone;
  isEstimate?: boolean;
  footer?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const change = metric.changePercent;
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className={cn("tabular text-2xl font-semibold", TONE_ACCENT[tone])}>
          {formatMetric(metric.value, metric.unit, currency)}
        </p>
        {metric.unit && metric.unit !== "INR" ? (
          <span className="text-xs text-muted-foreground">{metric.unit}</span>
        ) : null}
        {isEstimate ? (
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {t("common.estimate")}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {/* Numbers always carry their source / date-range context. */}
        <p className="text-xs text-muted-foreground">{metric.context}</p>
        {typeof change === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              change >= 0 ? "text-success" : "text-danger",
            )}
          >
            {change >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(change)}%
          </span>
        ) : null}
      </div>
      {footer ? <div className="mt-3 border-t pt-3 text-sm">{footer}</div> : null}
    </div>
  );
}
