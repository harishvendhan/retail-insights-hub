import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { StockStatus } from "@/types/api";

const STYLES: Record<StockStatus, string> = {
  healthy: "bg-success-soft text-success border-success/25",
  low_stock: "bg-warning-soft text-warning-foreground border-warning/40",
  out_of_stock: "bg-danger-soft text-danger border-danger/25",
  expiring: "bg-expiring-soft text-expiring border-expiring/30",
};

const DOTS: Record<StockStatus, string> = {
  healthy: "bg-success",
  low_stock: "bg-warning",
  out_of_stock: "bg-danger",
  expiring: "bg-expiring",
};

/** Renders the backend-supplied stock_status. Status is never recomputed here. */
export function StatusBadge({ status, className }: { status: StockStatus; className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOTS[status])} />
      {t(`status.${status}`)}
    </span>
  );
}
