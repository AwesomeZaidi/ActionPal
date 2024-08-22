import { TRPCError } from "@trpc/server";
import { lucia, validateOneTimePassword } from "auth";
import { UserOneTimePasswordTypeSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const verifyOtp = publicProcedure
  .input(
    z.object({
      type: UserOneTimePasswordTypeSchema,
      identifier: z.string(),  // Phone number becomes the identifier
      code: z.string(),
    })
  )
  .mutation(
    async ({ input: { type, identifier, code }, ctx: { responseHeaders } }) => {
      try {
        const userId = await validateOneTimePassword({
          type,
          identifier,  // Phone number as the identifier
          code,
        });

        const user = await db.user.findFirst({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        if (!user.phoneVerified) {
          await db.user.update({
            where: { id: user.id },
            data: {
              phoneVerified: true,
            },
          });
        }

        const session = await lucia.createSession(userId, {});

        const sessionCookie = lucia.createSessionCookie(session.id);
        responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

        return session;
      } catch (e) {
        console.error(e);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid one-time password",
        });
      }
    },
  );
