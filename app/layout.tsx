import { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import clsx from "clsx";

import StoreProvider from "./StoreProvider";
import { Providers } from "./providers";

import { notoSans } from "@/config/font";

export const metadata: Metadata = {
    title: "trek",
    description: "",
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body className={clsx("min-h-screen text-foreground overflow-hidden bg-background font-sans antialiased", notoSans.variable)}>
                <StoreProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                        <div className="relative flex flex-col h-screen">
                            <main className="container mx-auto max-w-7xl flex-grow">{children}</main>
                        </div>
                    </Providers>
                </StoreProvider>
            </body>
        </html>
    );
}
