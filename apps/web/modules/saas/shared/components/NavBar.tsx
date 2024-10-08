"use client";

import { Link } from "@i18n";
import { UserMenu } from "@marketing/shared/components/UserMenu";
import { Logo } from "@shared/components/Logo";
import type { ApiOutput } from "api/trpc/router";
import { UserRoleSchema } from "database";
import { GridIcon, SettingsIcon, UserCogIcon, Wand2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useCallback } from "react";

type User = ApiOutput["auth"]["user"];

export function NavBar({ user }: PropsWithChildren<{ user: User }>) {
  const t = useTranslations();
  const pathname = usePathname();
  const isAdmin = user?.role === UserRoleSchema.Values.ADMIN;

  const menuItems = [
    {
      label: t("dashboard.menu.dashboard"),
      href: `/app/dashboard`,
      icon: GridIcon,
    },
    {
      label: t("dashboard.menu.aiDemo"),
      href: `/app/ai-demo`,
      icon: Wand2Icon,
    },
    {
      label: t("dashboard.menu.settings"),
      href: `/app/settings`,
      icon: SettingsIcon,
    },
    ...(isAdmin
      ? [
          {
            label: t("dashboard.menu.admin"),
            href: `/app/admin`,
            icon: UserCogIcon,
          },
        ]
      : []),
  ];

  const isActiveMenuItem = useCallback(
    (href: string | null) => {
      return href && pathname.includes(href);
    },
    [pathname],
  );

  return (
    <nav className="bg-muted w-full border-b">
      <div className="container max-w-6xl py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="block">
              <Logo withLabel={false} />
            </Link>
          </div>

          <div className="ml-auto mr-0 flex items-center justify-end gap-4">
            <UserMenu />
          </div>
        </div>

        <ul className="no-scrollbar -mx-8 -mb-4 mt-6 flex list-none items-center justify-start gap-6 overflow-x-auto px-8 text-sm lg:text-base">
          {menuItems.map((menuItem) => (
            <li key={menuItem.href}>
              <Link
                href={menuItem.href}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 ${
                  isActiveMenuItem(menuItem.href)
                    ? "border-primary font-bold"
                    : "border-transparent"
                }`}
              >
                <menuItem.icon
                  className={`size-4 shrink-0 ${
                    isActiveMenuItem(menuItem.href) ? "text-primary" : ""
                  }`}
                />
                <span>{menuItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
