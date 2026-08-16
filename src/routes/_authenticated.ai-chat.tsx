import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/_authenticated/ai-chat")({
  head: () => ({
    meta: [
      { title: "ai chat — SuperIntel" },
      { name: "description", content: "ai chat workspace for your supermarket, powered by live store data." },
      { property: "og:title", content: "ai chat — SuperIntel" },
      { property: "og:description", content: "ai chat workspace for your supermarket." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="ai chat" subtitle={t("common.comingSoon")} />
      <SectionCard title="ai chat">
        <EmptyState title={t("common.comingSoon")} />
      </SectionCard>
    </>
  );
}
