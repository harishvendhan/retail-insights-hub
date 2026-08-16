import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingSkeleton({
  rows = 5,
  className,
  variant = "list",
}: {
  rows?: number;
  className?: string;
  variant?: "list" | "cards" | "chart";
}) {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-7 w-32" />
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }
  if (variant === "chart") {
    return <Skeleton className={cn("h-72 w-full rounded-xl", className)} />;
  }
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 px-6 py-14 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <p className="text-base font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const message = error instanceof Error ? error.message : undefined;
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-danger/30 bg-danger-soft/60 px-6 py-12 text-center",
        className,
      )}
    >
      <AlertTriangle className="mb-3 size-6 text-danger" />
      <p className="text-base font-semibold">{t("common.errorTitle")}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message ?? t("common.errorBody")}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RefreshCw className="size-4" />
          {t("common.retry")}
        </Button>
      ) : null}
    </div>
  );
}

/** Standard loading/error/empty/populated wrapper for every data view. */
export function QueryState<T>({
  isLoading,
  error,
  data,
  onRetry,
  empty,
  skeleton,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  data: T | undefined;
  onRetry?: () => void;
  empty?: ReactNode;
  skeleton?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}) {
  if (isLoading) return <>{skeleton ?? <LoadingSkeleton />}</>;
  if (error) return <ErrorState error={error} {...(onRetry ? { onRetry } : {})} />;
  if (!data) return <>{empty ?? <EmptyState title="—" />}</>;
  return <>{children(data)}</>;
}
