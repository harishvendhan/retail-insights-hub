import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useDashboardSummary } from "@/hooks/api";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InsightCard } from "@/components/shared/InsightCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/shared/States";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Store dashboard — SuperIntel" },
      { name: "description", content: "Daily, weekly and monthly sales, inventory value and stock alerts for your supermarket." },
      { property: "og:title", content: "Store dashboard — SuperIntel" },
      { property: "og:description", content: "Sales, inventory value and stock alerts for your supermarket." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useDashboardSummary();

  return (
    <>
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />
      {isLoading ? <LoadingSkeleton variant="cards" rows={8} /> : null}
      {error ? <ErrorState error={error} onRetry={() => void refetch()} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t("dashboard.todaySales")} metric={data.todaySales} currency={data.currency} tone="brand" />
            <StatCard label={t("dashboard.weeklySales")} metric={data.weeklySales} currency={data.currency} />
            <StatCard label={t("dashboard.monthlySales")} metric={data.monthlySales} currency={data.currency} />
            <StatCard label={t("dashboard.totalRevenue")} metric={data.totalRevenue} currency={data.currency} />
            <StatCard label={t("dashboard.totalProducts")} metric={data.totalProducts} />
            <StatCard label={t("dashboard.totalUnitsSold")} metric={data.totalUnitsSold} />
            <StatCard label={t("dashboard.inventoryValue")} metric={data.inventoryValue} currency={data.currency} />
            <StatCard label={t("dashboard.lowStockCount")} metric={data.lowStockCount} tone="warning" />
            <StatCard label={t("dashboard.outOfStockCount")} metric={data.outOfStockCount} tone="danger" />
            <StatCard label={t("dashboard.expiringCount")} metric={data.expiringCount} tone="expiring" />
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.bestSelling")}</p>
              <p className="mt-3 text-lg font-semibold">{data.bestSellingProduct.name}</p>
              <p className="tabular text-sm text-success">
                {formatNumber(data.bestSellingProduct.value)} {data.bestSellingProduct.unit}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{data.bestSellingProduct.context}</p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.slowMoving")}</p>
              <p className="mt-3 text-lg font-semibold">{data.slowMovingProduct.name}</p>
              <p className="tabular text-sm text-warning-foreground">
                {formatNumber(data.slowMovingProduct.value)} {data.slowMovingProduct.unit}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{data.slowMovingProduct.context}</p>
            </div>
          </div>

          <SectionCard title={t("dashboard.insights")} description={data.generatedAt}>
            {data.insights.length === 0 ? (
              <EmptyState title={t("dashboard.insightsEmpty")} />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {data.insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )}
          </SectionCard>
        </>
      ) : null}
    </>
  );
}
