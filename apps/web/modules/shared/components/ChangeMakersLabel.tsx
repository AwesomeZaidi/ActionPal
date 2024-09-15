"use client";

import { useTheme } from "next-themes";

export function ChangeMakersLabel() {

  const { theme } = useTheme();

  // TODO MAKE THIS RED ON LIGHT - WHY IS IT NOT WORKING?
  return (
    <>
      {
        theme === "light" ? (
          <div className="flex">
            <h1 className="text-3xl font-black lg:text-7xl m-0 vertical-text opacity-50 italic">
              CHANGE
            </h1>
            <h1 className="mx-auto max-w-3xl text-3xl font-black lg:text-7xl m-0 vertical-text opacity-50 italic">
              MAKERS
            </h1>
          </div>
        ) : (
          <div className="flex">
            <h1 className="text-3xl font-black lg:text-7xl m-0 vertical-text opacity-50 italic">
              CHANGE
            </h1>
            <h1 className="mx-auto max-w-3xl text-3xl font-black lg:text-7xl m-0 vertical-text opacity-50 italic">
              MAKERS
            </h1>
          </div>
        )
      }
    </>
  )
}
