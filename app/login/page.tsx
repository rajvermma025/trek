"use client";

import { Button, Form, Input } from "@heroui/react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

import { useAppDispatch } from "@/lib/hooks";
import { login } from "@/slices/authSlice";

export default function Component() {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useAppDispatch();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = {
            email: typeof formData.get("email") === "string" ? (formData.get("email") as string) : "",
            password: typeof formData.get("password") === "string" ? (formData.get("password") as string) : "",
        };

        const res = await dispatch(login({ values: data }));

        if (login.fulfilled.match(res)) {
            redirect("/dashboard");
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
                <p className="pb-4 text-left text-3xl font-semibold">Log In</p>
                <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input isRequired label="Email" name="email" type="email" />
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
                    />
                    <Button className="w-full" color="primary" type="submit">
                        Log In
                    </Button>
                </Form>
            </div>
        </div>
    );
}
