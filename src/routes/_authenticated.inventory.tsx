import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useFilterOptions, useProducts } from "@/hooks/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Product, StockStatus } from "@/types/api";

const FILTER_MAP: Record<string, StockStatus> = {
  "low-stock": "low_stock",
  "out-of-stock": "out_of_stock",
  expiring: "expiring",
  healthy: "healthy",
};

export const Route = createFileRoute("/_authenticated/inventory")({
  validateSearch: (search: Record<string, unknown>) => ({
    filter: typeof search['filter'] === "string" ? search['filter'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Inventory & stock status — SuperIntel" },
      { name: "description", content: "Search, filter and review every product with live stock status, reorder levels and expiry." },
      { property: "og:title", content: "Inventory & stock status — SuperIntel" },
      { property: "og:description", content: "Live stock status, reorder levels and expiry for every product." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filter } = Route.useSearch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [supplierId, setSupplierId] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const stockStatus = (filter && FILTER_MAP[filter]) ?? "all";
  const { data: options } = useFilterOptions();
  const query = { search, category, brand, supplierId, stockStatus, sortBy, sortDir, page, pageSize: 10 };
  const { data, isLoading, error, refetch } = useProducts(query);

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: t("inventory.product"),
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <p lang="ta" className="text-xs text-muted-foreground">{p.nameTa}</p>
        </div>
      ),
    },
    { key: "sku", header: t("inventory.sku"), render: (p) => <span className="font-mono text-xs">{p.sku}</span> },
    { key: "category", header: t("inventory.category"), render: (p) => p.category },
    { key: "brand", header: t("inventory.brand"), render: (p) => p.brand },
    { key: "currentStock", header: t("inventory.stock"), sortable: true, align: "right", render: (p) => `${p.currentStock} ${p.unit}` },
    { key: "reorderLevel", header: t("inventory.reorderLevel"), align: "right", render: (p) => p.reorderLevel },
    { key: "stockValue", header: t("inventory.stockValue"), sortable: true, align: "right", render: (p) => formatCurrency(p.stockValue) },
    { key: "expiryDate", header: t("inventory.expiry"), render: (p) => formatDate(p.expiryDate) },
    { key: "stockStatus", header: t("inventory.stockStatus"), render: (p) => <StatusBadge status={p.stockStatus} /> },
  ];

  const selects: { value: string; onChange: (v: string) => void; label: string; items: { value: string; label: string }[] }[] = [
    { value: category, onChange: setCategory, label: t("inventory.category"), items: (options?.categories ?? []).map((c) => ({ value: c, label: c })) },
    { value: brand, onChange: setBrand, label: t("inventory.brand"), items: (options?.brands ?? []).map((b) => ({ value: b, label: b })) },
    { value: supplierId, onChange: setSupplierId, label: t("inventory.supplier"), items: (options?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })) },
  ];

  return (
    <>
      <PageHeader title={t("inventory.title")} subtitle={t("inventory.subtitle")} />
      <div className="flex flex-wrap gap-3">
        <Input
          className="w-full sm:max-w-xs"
          placeholder={t("inventory.searchPlaceholder")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        {selects.map((s) => (
          <select
            key={s.label}
            aria-label={s.label}
            value={s.value}
            onChange={(e) => { s.onChange(e.target.value); setPage(1); }}
            className="h-9 rounded-md border bg-card px-3 text-sm"
          >
            <option value="all">{s.label}: {t("common.all")}</option>
            {s.items.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        ))}
        <select
          aria-label={t("inventory.stockStatus")}
          value={filter ?? "all"}
          onChange={(e) => {
            const v = e.target.value;
            setPage(1);
            void navigate({ to: "/inventory", search: v === "all" ? {} : { filter: v } });
          }}
          className="h-9 rounded-md border bg-card px-3 text-sm"
        >
          <option value="all">{t("inventory.stockStatus")}: {t("common.all")}</option>
          <option value="healthy">{t("status.healthy")}</option>
          <option value="low-stock">{t("status.low_stock")}</option>
          <option value="out-of-stock">{t("status.out_of_stock")}</option>
          <option value="expiring">{t("status.expiring")}</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        emptyTitle={t("inventory.empty")}
        emptyDescription={t("inventory.emptyCta")}
        onRowClick={(p) => void navigate({ to: "/inventory/$productId", params: { productId: p.id } })}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={(key, dir) => { setSortBy(key); setSortDir(dir); }}
        page={data?.page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        context={`${t("common.asOf")} ${new Date().toLocaleString("en-IN")}`}
      />
    </>
  );
}
