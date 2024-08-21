import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { UserAvatar } from "@shared/components/UserAvatar";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
export default async function SettingsLayout({ children }: PropsWithChildren) {
  const t = await getTranslations();
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user();

  if (!user) {
    return redirect("/auth/login");
  }

  const menuItems = [
    {
      title: t("settings.menu.account.title"),
      avatar: <UserAvatar name={user.name ?? ""} avatarUrl={user.avatarUrl} />,
      items: [
        {
          title: t("settings.menu.account.general"),
          href: `/app/settings/account/general`,
        },
        {
          title: t("settings.menu.account.billing"),
          href: `/app/settings/account/billing`,
        },
      ],
    },
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="align-start flex flex-col gap-8 md:flex-row">
        <div className="w-full md:max-w-[200px]">
          <SettingsMenu menuItems={menuItems} />
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
