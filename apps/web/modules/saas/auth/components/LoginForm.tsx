"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUser } from "../hooks/use-user";
import { OtpForm } from "./LoginOtpForm";
import { PhoneNumberForm } from "./PhoneNumberForm";

export function LoginForm() {
  const [phone, setPhone] = useState<string | null>(null);
  const { user, loaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const handleOtpSent = (phone: string) => {
    setPhone(phone);
  };

  const handleVerifySuccess = () => {
    router.replace(redirectTo);
  };

  if (user && loaded) {
    router.replace(redirectTo);
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold md:text-4xl">
        Welcome back
      </h1>
      <p className="text-muted-foreground mb-6 mt-4">
        Please enter your credentials to sign in.
      </p>

      {!phone ? (
        <PhoneNumberForm onOtpSent={handleOtpSent} />
      ) : (
        <OtpForm phone={phone} onVerifySuccess={handleVerifySuccess} />
      )}
    </div>
  );
}
