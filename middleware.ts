import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/onboard"];
const ROLE_ACCESS: Record<string, string[]> = {
    ADMIN: ["/dashboard", "/projects", "/team"],
    MANAGER: ["/dashboard", "/projects"],
    EMPLOYEE: ["/projects"],
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

    if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
        const res = NextResponse.redirect(new URL("/login", req.url));

        clearAuthCookies(res);

        return res;
    }

    if (token) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const userRole = (payload as any).role;
            const allowedRoutes = ROLE_ACCESS[userRole] || [];

            const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

            if (!isAllowed) {
                const defaultRedirect = allowedRoutes[0] || "/login";

                return NextResponse.redirect(new URL(defaultRedirect, req.url));
            }

            return NextResponse.next();
        } catch {
            const res = NextResponse.redirect(new URL("/login", req.url));

            clearAuthCookies(res);

            return res;
        }
    }

    return NextResponse.next();
}

// Utility to clear all auth-related cookies
function clearAuthCookies(response: NextResponse) {
    const cookieNames = ["token", "email", "id", "firstName", "lastName", "role"];

    cookieNames.forEach((name) => {
        response.cookies.set(name, "", {
            path: "/",
            maxAge: 0,
        });
    });
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api|static|assets|public).*)"],
};
