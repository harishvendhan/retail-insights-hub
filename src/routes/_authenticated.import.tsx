import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/_authenticated/import")({
  head: () => ({
    meta: [
      { title: "import — SuperIntel" },
      { name: "description", content: "import workspace for your supermarket, powered by live store data." },
      { property: "og:title", content: "import — SuperIntel" },
      { property: "og:description", content: "import workspace for your supermarket." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="import" subtitle={t("common.comingSoon")} />
      <SectionCard title="import">
        <EmptyState title={t("common.comingSoon")} />
      </SectionCard>
    </>
  );
}
