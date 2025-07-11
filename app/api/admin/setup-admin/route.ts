// app/api/setup-admin/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    const { email, password, secret } = await req.json();

    if (secret !== process.env.ADMIN_SETUP_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const existing = await User.findOne({ email });

    if (existing) {
        return NextResponse.json({ message: "Admin already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        firstName: "Admin",
        lastName: "Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
        isOnboarded: true,
    });

    return NextResponse.json({ message: "Admin created" });
}
