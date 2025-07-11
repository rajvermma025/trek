"use client";

import type { ThemeProviderProps } from "next-themes";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export function Providers({ children, themeProps }: Readonly<ProvidersProps>) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ToastProvider
                    placement="top-right"
                    toastProps={{
                        radius: "md",
                        variant: "flat",
                        hideIcon: true,
                    }}
                />
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
