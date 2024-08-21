import { SubscriptionSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const subscription = protectedProcedure
  .input(z.void())
  .output(SubscriptionSchema.nullable())
  .query(async ({ ctx: { user } }) => {
    const subscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    return subscription;
  });
