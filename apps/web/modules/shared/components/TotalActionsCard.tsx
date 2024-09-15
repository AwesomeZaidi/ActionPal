"use client";

import { useTheme } from "next-themes";

export function TotalActionsCard() {

    const { theme } = useTheme();

    return (
        <>
            {
                theme === "light" ? (
                    <div className="bg-card-light dark:bg-card-dark border-card-light dark:border-card-dark text-card-light dark:text-card-dark p-4 rounded-md shadow-lg text-left">
                        <p className="text-3xl font-bold mb-2 text-foreground">742</p>
                        <p className="text-xl text-foreground">
                            <span className="font-semibold text-foreground">Actions</span> were taken through our app ❤️
                        </p>
                    </div>

                ) : (
                    <div className="bg-card-dark dark:bg-card-dark text-card-dark dark:text-card-dark border-card-light dark:border-card-light text-left">
                        <p className="text-3xl font-bold mb-2">742</p>
                        <p className="text-xl">
                            <span className="font-semibold">Actions</span> were taken through our app ❤️
                        </p>
                    </div>
                )
            }
        </>
    )
}
