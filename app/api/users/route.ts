import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const token = req.cookies.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role === "EMPLOYEE") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        if (!role || !["MANAGER", "EMPLOYEE"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const users = await User.find({ role, isDeleted: { $ne: true } }).select("-password");

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const token = req.cookies.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role === "EMPLOYEE") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const data = await req.json();

        const { firstName, lastName, email, role, hourlyRate } = data;

        if (!firstName || !lastName || !email || !role) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!["MANAGER", "EMPLOYEE"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const onboardToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            role,
            password: "TEMP", // Will be updated during onboarding
            hourlyRate: role === "EMPLOYEE" ? hourlyRate : undefined,
            isOnboarded: false,
            onboardToken: onboardToken,
            onboardTokenExpiry: expiry,
        });

        const onboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/onboard?token=${onboardToken}`;

        await sendEmail({
            to: email,
            subject: "Complete your onboarding",
            html: `<p>Hello ${firstName} ${lastName},</p>
              <p>You have been invited as a ${role}. Click below to create your password:</p>
              <a href="${onboardUrl}">${onboardUrl}</a>
              <p>This link is valid for 24 hours.</p>`,
        });

        return NextResponse.json({ message: "User created", userId: newUser._id });
    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
