import { generateOneTimePassword } from "auth";
import { sendSms } from "auth/lib/sms";
import { db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const sendOtp = publicProcedure
    .input(
        z.object({
            phone: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"),
            type: z.enum(["SIGNUP", "LOGIN", "PASSWORD_RESET"]), // Add type as an input
        })
    )
    .mutation(async ({ input }) => {
        const { phone, type } = input;

        // Check if a user exists with this phone number
        let user = await db.user.findUnique({ where: { phone } });

        // If user doesn't exist, create a new user
        if (!user) {
            user = await db.user.create({
                data: {
                    phone,
                },
            });
        }

        // Generate OTP with the passed type
        const otp = await generateOneTimePassword({
            userId: user.id,
            type,
            identifier: phone,
        });

        // Send OTP via SMS
        await sendSms(phone, `Your Action Pal code is: ${otp}`);

        return { success: true };
    });

