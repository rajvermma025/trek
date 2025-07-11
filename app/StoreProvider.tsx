"use client";
import { Provider } from "react-redux";
import { useRef } from "react";

import { makeStore, AppStore } from "../lib/store";

export default function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const storeRef = useRef<AppStore | null>(null);

    storeRef.current ??= makeStore();

    return <Provider store={storeRef.current}>{children}</Provider>;
}
