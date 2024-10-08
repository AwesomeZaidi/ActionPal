import { NavBar } from "@marketing/shared/components/NavBar";
import { UserContextProvider } from "@saas/auth/lib/user-context";
import type { PropsWithChildren } from "react";

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <UserContextProvider initialUser={null}>
      <NavBar />
      <main className="min-h-screen pt-32">{children}</main>
      {/* <Footer /> */}
    </UserContextProvider>
  );
}
