import { UserContextProvider } from "@saas/auth/lib/user-context";
import { Footer } from "@saas/shared/components/Footer";
import { NavBar } from "@saas/shared/components/NavBar";
import { createApiCaller } from "api/trpc/caller";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }: PropsWithChildren) {
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user()

  if (!user) {
    return redirect("/auth/login");
  }

  // if (!user.onboardingComplete) {
  //   return redirect("/onboarding");
  // }

  return (
    <UserContextProvider initialUser={user}>
      <div className="bg-muted min-h-screen">
        <NavBar user={user} />
        <main className="bg-muted">{children}</main>
        <Footer />
      </div>
    </UserContextProvider>
  );
}
