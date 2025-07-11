import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ onboardToken: token });

        if (!user.onboardTokenExpiry || user.onboardTokenExpiry < new Date()) {
            return NextResponse.json({ message: "Link expired or invalid" }, { status: 410 });
        }

        user.password = await bcrypt.hash(password, 10);
        user.onboardToken = undefined;
        user.onboardTokenExpiry = undefined;
        user.isOnboarded = true;

        await user.save();

        return NextResponse.json({ message: "User Onboarded Successfully." });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
