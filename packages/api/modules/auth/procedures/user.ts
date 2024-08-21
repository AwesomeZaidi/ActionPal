import { UserSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";
import { getUserAvatarUrl } from "../lib/avatar-url";

export const user = publicProcedure
  .input(z.void())
  .output(
    UserSchema.pick({
      id: true,
      email: true,
      role: true,
      avatarUrl: true,
      name: true,
      onboardingComplete: true,
    })
      .extend({
        impersonatedBy: UserSchema.pick({
          id: true,
          name: true,
        }).nullish(),
      })
      .nullable(),
  )
  .query(async ({ ctx: { user, session } }) => {
    if (!user) {
      return null;
    }

    const impersonatedBy = session?.impersonatorId
      ? await db.user.findUnique({
          where: {
            id: session.impersonatorId,
          },
          select: {
            id: true,
            name: true,
          },
        })
      : undefined;

    return {
      ...user,
      avatarUrl: await getUserAvatarUrl(user.avatarUrl),
      impersonatedBy,
    };
  });
