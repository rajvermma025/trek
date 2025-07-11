"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/slices/authSlice";

const Header = () => {
    const user = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname.startsWith(path);

    const renderLinks = () => {
        if (!user) return null;

        const links = [];

        if (user.role === "ADMIN") {
            links.push({ href: "/dashboard", label: "Dashboard" });
            links.push({ href: "/team", label: "Teams" });
            links.push({ href: "/projects", label: "Projects" });
        } else if (user.role === "MANAGER") {
            links.push({ href: "/dashboard", label: "Dashboard" });
            links.push({ href: "/projects", label: "Projects" });
        }

        return links.map(({ href, label }) => (
            <Link key={href} className={`hover:underline ${isActive(href) ? "text-blue-600 font-semibold underline" : ""}`} href={href}>
                {label}
            </Link>
        ));
    };

    const handleLogout = () => {
        dispatch(logout({ router }));
    };

    return (
        <div className="p-4 md:p-6 contact-header flex justify-between items-center gap-4 w-full">
            <div className="text-xl font-semibold">Trek</div>
            <nav className="flex space-x-6 text-sm">{renderLinks()}</nav>
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <User
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                        }}
                        className="transition-transform"
                        description={user.role}
                        name={user.firstName + "" + user.lastName}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-bold">Signed in as</p>
                        <p className="font-bold">{user.role}</p>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default Header;
