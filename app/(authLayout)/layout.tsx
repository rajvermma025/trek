import React from "react";

import Header from "@/components/Header";
import { getAuthFromCookies } from "@/utils/getAuthFromCookies";
import AuthProvider from "@/providers/AuthProvider";

const AuthLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const data = await getAuthFromCookies();

    return (
        <AuthProvider initialAuth={data}>
            <div className="flex flex-col w-full h-dvh overflow-hidden">
                <Header />
                {children}
            </div>
        </AuthProvider>
    );
};

export default AuthLayout;
