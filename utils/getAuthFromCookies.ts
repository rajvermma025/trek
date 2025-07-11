import { cookies } from "next/headers";

export async function getAuthFromCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const email = cookieStore.get("email")?.value;
    const firstName = cookieStore.get("firstName")?.value;
    const id = cookieStore.get("id")?.value;
    const lastName = cookieStore.get("lastName")?.value;
    const role = cookieStore.get("role")?.value;

    if (!token) return null;

    return {
        token,
        email,
        firstName,
        id,
        lastName,
        role,
    };
}
