"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/input";
import { Button, Form } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { onboardUser } from "@/slices/authSlice";

export default function OnboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const { loading, error } = useAppSelector((state) => state.auth);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const result = await dispatch(onboardUser({ token, password }));

        if (onboardUser.fulfilled.match(result)) {
            router.push("/login");
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Invalid or missing token</h1>
                <p>Please check your onboarding link.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
                <p className="pb-4 text-left text-3xl font-semibold">Set Password</p>
                <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                ) : (
                                    <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                )}
                            </button>
                        }
                        label="Password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button className="w-full" color="primary" isLoading={loading} type="submit">
                        Submit
                    </Button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </Form>
            </div>
        </div>
    );
}
