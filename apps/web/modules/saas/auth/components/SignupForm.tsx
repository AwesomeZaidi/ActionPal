"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@i18n";
import { apiClient } from "@shared/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { AlertTriangleIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"),
  otp: z.optional(z.string().min(6).max(6, "Invalid OTP")),
});

type FormValues = z.infer<typeof formSchema>;

export function SignupForm() {
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);
  const [isOtpSent, setOtpSent] = useState(false);
  const searchParams = useSearchParams();

  const sendOtpMutation = apiClient.auth.sendOtp.useMutation();
  const verifyOtpMutation = apiClient.auth.verifyOtp.useMutation();

  const redirectTo = searchParams.get("redirectTo") ?? "/app";
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (phone) {
      form.setValue("phone", phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const onSubmit: SubmitHandler<FormValues> = async ({ phone, otp }) => {
    setServerError(null);
    try {
      if (!isOtpSent) {
        await sendOtpMutation.mutateAsync({ phone });
        setOtpSent(true);
      } else {
        await verifyOtpMutation.mutateAsync({ phone, otp: otp! });
        router.replace(redirectTo);
      }
    } catch (e) {
      setServerError({
        title: t("auth.signup.hints.signupFailed.title"),
        message: t("auth.signup.hints.signupFailed.message"),
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">
        {t("auth.signup.title")}
      </h1>
      <p className="text-muted-foreground mb-6 mt-2">
        {t("auth.signup.message")}
      </p>

      <Form {...form}>
        <form
          className="flex flex-col items-stretch gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitted && serverError && (
            <Alert variant="error">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>{serverError.title}</AlertTitle>
              <AlertDescription>{serverError.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sign up with Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="tel" />
                </FormControl>
              </FormItem>
            )}
          />

          {isOtpSent && (
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.signup.otp")}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="one-time-code" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <Button loading={form.formState.isSubmitting}>
            {isOtpSent ? t("auth.signup.verifyOtp") : 'Send Code'}
          </Button>

          <div>
            <span className="text-muted-foreground">
              {t("auth.signup.alreadyHaveAccount")}{" "}
            </span>
            <Link href={`/auth/login`}>
              {t("auth.signup.signIn")}
              <ArrowRightIcon className="ml-1 inline size-4 align-middle" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
