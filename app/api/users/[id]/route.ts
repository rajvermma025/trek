import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        const token = req.cookies.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const updateData = await req.json();
        const { id } = params;

        const user = await User.findById(id);

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        Object.assign(user, updateData);
        if (user.role !== "EMPLOYEE") user.hourlyRate = undefined;

        await user.save();

        return NextResponse.json({ message: "User updated" });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        const token = req.cookies.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { id } = params;

        const user = await User.findById(id);

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        user.isDeleted = true;
        await user.save();

        return NextResponse.json({ message: "User soft-deleted" });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
