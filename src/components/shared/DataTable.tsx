import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingSkeleton } from "./States";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right";
  className?: string;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Server-side sorting — the table never sorts data itself. */
  sortBy?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
  onSortChange?: (key: string, dir: "asc" | "desc") => void;
  /** Server-side pagination — the table never slices a full dataset. */
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  /** Context line describing the source/date range of these numbers. */
  context?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRowClick,
  sortBy,
  sortDir,
  onSortChange,
  page,
  totalPages,
  total,
  onPageChange,
  context,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState error={error} {...(onRetry ? { onRetry } : {})} />;
  if (!rows || rows.length === 0)
    return (
      <EmptyState
        title={emptyTitle ?? t("common.noData")}
        {...(emptyDescription ? { description: emptyDescription } : {})}
        {...(emptyAction ? { action: emptyAction } : {})}
      />
    );

  return (
    <div className="space-y-3">
      {context ? <p className="text-xs text-muted-foreground">{context}</p> : null}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              {columns.map((col) => {
                const active = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                      col.align === "right" && "text-right",
                      col.className,
                    )}
                  >
                    {col.sortable && onSortChange ? (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 hover:text-foreground",
                          active && "text-foreground",
                        )}
                        onClick={() =>
                          onSortChange(col.key, active && sortDir === "asc" ? "desc" : "asc")
                        }
                      >
                        {col.header}
                        {active ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b last:border-0",
                  onRowClick && "cursor-pointer transition-colors hover:bg-accent/40",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 align-middle", col.align === "right" && "text-right tabular")}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page && totalPages && onPageChange ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t("common.page")} {page} {t("common.of")} {totalPages}
            {typeof total === "number" ? ` · ${total} ${t("common.rows")}` : ""}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="size-4" />
              {t("common.back")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              {t("common.next")}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
