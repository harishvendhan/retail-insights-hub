import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useProduct } from "@/hooks/api";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { ErrorState, LoadingSkeleton } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/inventory/$productId")({
  head: () => ({
    meta: [
      { title: "Product detail — SuperIntel" },
      { name: "description", content: "Stock, pricing, supplier and movement history for a single product." },
      { property: "og:title", content: "Product detail — SuperIntel" },
      { property: "og:description", content: "Stock, pricing and supplier detail for a single product." },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { t } = useTranslation();
  const { productId } = Route.useParams();
  const { data, isLoading, error, refetch } = useProduct(productId);

  if (isLoading) return <LoadingSkeleton variant="cards" rows={4} />;
  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (!data) return null;

  return (
    <>
      <PageHeader title={data.name} subtitle={data.nameTa} actions={<StatusBadge status={data.stockStatus} />} />
      <SectionCard title={t("inventory.title")}>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.stock")}</dt>
            <dd className="tabular text-sm font-medium">{data.currentStock} {data.unit}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.stockValue")}</dt>
            <dd className="tabular text-sm font-medium">{formatCurrency(data.stockValue)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.expiry")}</dt>
            <dd className="tabular text-sm font-medium">{formatDate(data.expiryDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.sku")}</dt>
            <dd className="font-mono text-sm">{data.sku}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.category")}</dt>
            <dd className="text-sm">{data.category}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("inventory.brand")}</dt>
            <dd className="text-sm">{data.brand}</dd>
          </div>
        </dl>
      </SectionCard>
    </>
  );
}
