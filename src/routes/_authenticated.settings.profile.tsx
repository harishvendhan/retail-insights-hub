import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  head: () => ({
    meta: [
      { title: "Store profile — SuperIntel" },
      { name: "description", content: "Review your store profile, account email and language preference." },
      { property: "og:title", content: "Store profile — SuperIntel" },
      { property: "og:description", content: "Review your store profile and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <>
      <PageHeader title={t("nav.profile")} />
      <SectionCard title={t("nav.profile")}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">{t("auth.name")}</dt>
            <dd className="text-sm font-medium">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("auth.storeName")}</dt>
            <dd className="text-sm font-medium">{user?.storeName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("auth.email")}</dt>
            <dd className="text-sm font-medium">{user?.email ?? "—"}</dd>
          </div>
        </dl>
      </SectionCard>
    </>
  );
}
