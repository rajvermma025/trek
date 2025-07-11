import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        const cookieStore = await cookies();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        };

        const userData = {
            token,
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
        };

        for (const [key, value] of Object.entries(userData)) {
            cookieStore.set(key, value, cookieOptions);
        }

        const userObj = user.toObject();

        delete userObj.password;

        return NextResponse.json({ message: "User Logged In successfully.", data: userObj });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
