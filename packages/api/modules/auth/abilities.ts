import type { SessionUser } from "auth";
import { UserRoleSchema } from "database";

export function defineAbilitiesFor({ user }: { user: SessionUser | null }) {
  const isAdmin = user?.role === UserRoleSchema.Values.ADMIN;

  return {
    isAdmin,
  };
}
