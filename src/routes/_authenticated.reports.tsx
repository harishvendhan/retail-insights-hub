import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "reports — SuperIntel" },
      { name: "description", content: "reports workspace for your supermarket, powered by live store data." },
      { property: "og:title", content: "reports — SuperIntel" },
      { property: "og:description", content: "reports workspace for your supermarket." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="reports" subtitle={t("common.comingSoon")} />
      <SectionCard title="reports">
        <EmptyState title={t("common.comingSoon")} />
      </SectionCard>
    </>
  );
}
