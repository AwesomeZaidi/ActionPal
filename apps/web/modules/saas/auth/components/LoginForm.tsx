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
import { useUser } from "../hooks/use-user";

const formSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"),
  otp: z.optional(z.string().min(6).max(6, "Invalid OTP")),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const { user, loaded } = useUser();
  const [isOtpSent, setOtpSent] = useState(false);
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);
  const searchParams = useSearchParams();

  const sendOtpMutation = apiClient.auth.sendOtp.useMutation();
  const verifyOtpMutation = apiClient.auth.verifyOtp.useMutation();

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const redirectTo = searchParams.get("redirectTo") ?? "/app";
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (phone) {
      form.setValue("phone", phone);
    }
  }, [phone]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    form.reset();
    setServerError(null);
  }, [isOtpSent]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRedirect = () => {
    router.replace(redirectTo);
  };

  useEffect(() => {
    if (user && loaded) {
      handleRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loaded]);

  const onSubmit: SubmitHandler<FormValues> = async ({ phone, otp }) => {
    setServerError(null);
    try {
      if (!isOtpSent) {
        await sendOtpMutation.mutateAsync({ phone, type: "LOGIN" });
        setOtpSent(true);
      } else {
        await verifyOtpMutation.mutateAsync({ phone, otp: otp! });
        handleRedirect();
      }
    } catch (e) {
      setServerError({
        title: t("auth.login.hints.invalidCredentials.title"),
        message: t("auth.login.hints.invalidCredentials.message"),
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold md:text-4xl">
        {t("auth.login.title")}
      </h1>
      <p className="text-muted-foreground mb-6 mt-4">
        {t("auth.login.subtitle")}
      </p>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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

          <Button
            className="w-full"
            type="submit"
            loading={form.formState.isSubmitting}
          >
            {isOtpSent ? t("auth.login.submit") : 'Send OTP'}
          </Button>

          <div>
            <span className="text-muted-foreground">
              {t("auth.login.dontHaveAnAccount")}{" "}
            </span>
            <Link href={`/auth/signup`}>
              {t("auth.login.createAnAccount")}
              <ArrowRightIcon className="ml-1 inline size-4 align-middle" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
