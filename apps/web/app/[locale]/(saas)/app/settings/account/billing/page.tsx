import { SubscriptionOverview } from "@saas/settings/components/SubscriptionOverview";
import { UpgradePlan } from "@saas/settings/components/UpgradePlan";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("settings.billing.title"),
  };
}

export default async function BillingSettingsPage() {
  const apiCaller = await createApiCaller();
  const plans = await apiCaller.billing.plans();
  const user = await apiCaller.auth.user();
  if (!user) {
    redirect("/auth/login");
  }

  const userSubscription = await apiCaller.billing.subscription();

  return (
    <div>
      <SubscriptionOverview
        plans={plans}
        currentSubscription={userSubscription}
        className="mb-4"
      />
      <UpgradePlan
        plans={plans}
        activePlanId={userSubscription?.planId}
        userId={user.id}
      />
    </div>
  );
}
