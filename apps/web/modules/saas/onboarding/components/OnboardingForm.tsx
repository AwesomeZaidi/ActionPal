"use client";

import { useUser } from "@saas/auth/hooks/use-user";
import { apiClient } from "@shared/lib/api-client";
import { clearCache } from "@shared/lib/cache";
import { Progress } from "@ui/components/progress";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingStep1 } from "./OnboardingStep1";

export function OnboardingForm() {
  const { updateUser } = useUser();
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalSteps = 1;
  const stepSearchParam = searchParams.get("step");
  const onboardingStep = stepSearchParam ? parseInt(stepSearchParam, 10) : 1;

  const updateUserMutation = apiClient.auth.update.useMutation();

  // eslint disable can be removed if you want to use this function for more onboarding steps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  const setStep = (step: number) => {
    router.replace(`?step=${step}`);
  };

  const onCompleted = async () => {
    await updateUserMutation.mutateAsync({
      onboardingComplete: true,
    });

    updateUser({
      onboardingComplete: true,
    });

    await clearCache();
    router.replace("/app/dashboard");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">
        {t("onboarding.title")}
      </h1>
      <p className="text-muted-foreground mb-6 mt-2">
        {t("onboarding.message")}
      </p>

      <div className="mb-6 flex items-center gap-3">
        <Progress value={(onboardingStep / totalSteps) * 100} className="h-2" />
        <span className="text-muted-foreground shrink-0 text-xs">
          {t("onboarding.step", {
            step: onboardingStep,
            total: totalSteps,
          })}
        </span>
      </div>

      {onboardingStep === 1 && (
        <OnboardingStep1 onCompleted={onCompleted} />
      )}
    </div>
  );
}
