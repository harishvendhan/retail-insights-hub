import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/_authenticated/suppliers")({
  head: () => ({
    meta: [
      { title: "suppliers — SuperIntel" },
      { name: "description", content: "suppliers workspace for your supermarket, powered by live store data." },
      { property: "og:title", content: "suppliers — SuperIntel" },
      { property: "og:description", content: "suppliers workspace for your supermarket." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="suppliers" subtitle={t("common.comingSoon")} />
      <SectionCard title="suppliers">
        <EmptyState title={t("common.comingSoon")} />
      </SectionCard>
    </>
  );
}
