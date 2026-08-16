import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/_authenticated/sales")({
  head: () => ({
    meta: [
      { title: "sales — SuperIntel" },
      { name: "description", content: "sales workspace for your supermarket, powered by live store data." },
      { property: "og:title", content: "sales — SuperIntel" },
      { property: "og:description", content: "sales workspace for your supermarket." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="sales" subtitle={t("common.comingSoon")} />
      <SectionCard title="sales">
        <EmptyState title={t("common.comingSoon")} />
      </SectionCard>
    </>
  );
}
