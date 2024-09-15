"use client";
import { Link } from "@i18n";
import { useUser } from "@saas/auth/hooks/use-user";
import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";

const Village = () => {
  const { user } = useUser();
  const { data: activeCTAs } = apiClient.cta.getActiveCTAs.useQuery();
  const cta = activeCTAs?.[0];
  const completedCTAs = [];
  const { theme } = useTheme();

  const cardContainerClassName =
    theme === "light"
      ? "bg-card-light dark:bg-card-dark border-card-light dark:border-card-dark text-card-light dark:text-card-dark p-4 rounded-md shadow-lg text-left"
      : "bg-card-dark dark:bg-card-dark text-card-dark dark:text-card-dark border-card-light dark:border-card-light text-left";

  const renderCTAContent = () => {
    if (!cta) {
      return (
        <>
          <p className="text-lg">
            <span className="font-bold">Please read:</span> We will text you
            when there is a call to action unlocked. The purpose of this app is
            for everyone to take action together at the same time. <br />
            Complete the call to action within 24 hours of being texted to
            increase your score! 🙏🏼 ❤️
          </p>
          <br />
          <p className="text-lg font-medium">~ Collective Community Action</p>
        </>
      );
    }

    // @ts-expect-error its ok
    if (completedCTAs.includes(cta)) {
      return (
        <div className="rounded-md border border-green-700 bg-green-900 p-4">
          <p className="text-lg font-semibold">Thanks for completing!</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border border-gray-700 bg-gray-900 p-4">
        <div>
          <div className="text-sm text-gray-400">
            <span className="font-bold text-white">18</span> / 52
            <span className="font-semibold text-white"> People</span> on our app
          </div>
          <div className="text-sm text-gray-400">
            took <span className="font-semibold text-white">action</span> this
            week
          </div>
        </div>
        <div className="my-4 text-base font-semibold">
          🚨 NEW WAY TO HELP UNLOCKED.
        </div>
        <Button size="lg" asChild>
          <Link href={`/cta/${cta.id || "auth/login"}`}>
            TAP TO ACT
            <ArrowRightIcon className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className={cardContainerClassName}>
      {user ? (
        <>{renderCTAContent()}</>
      ) : (
        <>
          <div className="my-2 flex flex-col justify-center gap-3 md:flex-row">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/auth/login">
                Get Notified
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          {renderCTAContent()}
        </>
      )}
    </div>
  );
};

export default Village;
