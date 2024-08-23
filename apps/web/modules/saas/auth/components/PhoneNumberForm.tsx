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

const phoneNumberSchema = z.object({
    phone: z
        .string()
        .min(10, "Invalid phone number")
        .max(15, "Invalid phone number"),
});

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

export function PhoneNumberForm({ onOtpSent }: { onOtpSent: (phone: string) => void }) {
    const form = useForm<PhoneNumberFormValues>({ resolver: zodResolver(phoneNumberSchema) });

    const sendOtpMutation = apiClient.auth.sendOtp.useMutation();

    const onSubmit = async (values: PhoneNumberFormValues) => {
        try {
            await sendOtpMutation.mutateAsync({ phone: values.phone, type: "LOGIN" });
            onOtpSent(values.phone);
        } catch (e) {
            console.error("Error sending OTP:", e);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete="tel"
                                    className={!!form.formState.errors.phone ? "border-red-600" : ""}
                                />
                            </FormControl>
                            {form.formState.errors.phone && (
                                <p className="text-red-600 text-sm">
                                    {form.formState.errors.phone.message}
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
                    Send Passcode
                </Button>
            </form>
        </Form>
    );
}
