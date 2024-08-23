"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

const otpSchema = z.object({
    otp: z
        .string()
        .min(6, "Invalid OTP")
        .max(6, "Invalid OTP"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function OtpForm({ phone, onVerifySuccess }: { phone: string; onVerifySuccess: () => void }) {
    const form = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });

    const verifyOtpMutation = apiClient.auth.verifyOtp.useMutation();

    const onSubmit = async (values: OtpFormValues) => {
        try {
            await verifyOtpMutation.mutateAsync({ identifier: phone, code: values.otp, type: 'LOGIN' });
            onVerifySuccess();
        } catch (e) {
            console.error("Error verifying OTP:", e);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Passcode</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete="one-time-code"
                                    className={!!form.formState.errors.otp ? "border-red-600" : ""}
                                />
                            </FormControl>
                            {form.formState.errors.otp && (
                                <p className="text-red-600 text-sm">
                                    {form.formState.errors.otp?.message}
                                </p>
                            )}
                        </FormItem>
                    )}
                />
                <Button
                    className="w-full"
                    type="submit"
                    loading={form.formState.isSubmitting}
                >
                    Sign In
                </Button>
            </form>
        </Form>
    );
}
