import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

    response.cookies.set("token", "", { path: "/", maxAge: 0 });
    response.cookies.set("email", "", { path: "/", maxAge: 0 });
    response.cookies.set("id", "", { path: "/", maxAge: 0 });
    response.cookies.set("firstName", "", { path: "/", maxAge: 0 });
    response.cookies.set("lastName", "", { path: "/", maxAge: 0 });
    response.cookies.set("role", "", { path: "/", maxAge: 0 });

    return response;
}
