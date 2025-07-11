// providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/lib/hooks";
import { setStateData } from "@/slices/authSlice";

export default function AuthProvider({ initialAuth, children }: Readonly<{ initialAuth: any; children: React.ReactNode }>) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (initialAuth) {
            dispatch(setStateData(initialAuth)); // set into redux
        }
    }, [initialAuth, dispatch]);

    return <>{children}</>;
}
