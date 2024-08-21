"use client";

import { apiClient } from "@shared/lib/api-client";
import { clearCache } from "@shared/lib/cache";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import type { ApiOutput } from "api/trpc/router";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { createContext, useEffect, useState } from "react";

type User = ApiOutput["auth"]["user"];

type UserContext = {
  user: User;
  reloadUser: () => Promise<void>;
  updateUser: (info: Partial<User>) => void;
  logout: () => Promise<void>;
  loaded: boolean;
}

const authBroadcastChannel = new BroadcastChannel("auth");
type AuthEvent = {
  type: "loaded" | "logout";
  user: User | null;
};

export const userContext = createContext<UserContext>({
  user: null,
  reloadUser: () => Promise.resolve(),
  updateUser: () => {
    return;
  },
  logout: () => Promise.resolve(),
  loaded: false,
});

export function UserContextProvider({
  children,
  initialUser,
}: PropsWithChildren<{
  initialUser: User;
}>) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(!!initialUser);
  const [user, setUser] = useState<User>(initialUser);
  const queryClient = useQueryClient();
  const userQuery = apiClient.auth.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !initialUser,
  });
  const logoutMutation = apiClient.auth.logout.useMutation();

  const reloadUser = async () => {
    await userQuery.refetch();
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    await clearCache();
    router.replace("/");
    queryClient.removeQueries({ queryKey: getQueryKey(apiClient.auth) });
    setUser(null);
    authBroadcastChannel.postMessage({
      type: "logout",
      user: null,
    } satisfies AuthEvent);
  };

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (userQuery.isSuccess) {
      setLoaded(true);
    }
  }, [userQuery.isSuccess]);

  useEffect(() => {
    if (user && loaded) {
      authBroadcastChannel.postMessage({
        type: "loaded",
        user: user,
      });
    }
  }, [user, loaded]);

  useEffect(() => {
    const handleAuthEvent = (event: MessageEvent<AuthEvent>) => {
      if (JSON.stringify(event.data.user) !== JSON.stringify(user)) {
        if (event.data.type === "logout") {
          queryClient.removeQueries({ queryKey: getQueryKey(apiClient.auth) });
          setUser(null);
          router.replace("/");
        } else {
          setUser(event.data.user);
        }
      }
    };

    authBroadcastChannel.addEventListener("message", handleAuthEvent);

    return () =>
      authBroadcastChannel.removeEventListener("message", handleAuthEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateUser = (info: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...info,
      });
    }
  };

  return (
    <userContext.Provider
      value={{
        user,
        reloadUser,
        logout,
        loaded,
        updateUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
