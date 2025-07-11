import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        await connectToDatabase();
        const { projectId } = await params;

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { name } = await req.json();

        const task = await Task.create({
            projectId,
            name,
            createdBy: user.userId,
        });

        return NextResponse.json({ message: "Task Added", data: task });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to create task", error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        await connectToDatabase();
        const { projectId } = await params;

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const updates = await req.json();

        const updateData: any = {};

        if (updates.status) updateData.status = updates.status;

        if (typeof updates.hoursSpent === "number") {
            // Push to array instead of replacing
            await Task.findByIdAndUpdate(projectId, {
                $push: { hoursSpent: updates.hoursSpent },
                ...(updateData.status && { status: updateData.status }),
            });
        } else {
            await Task.findByIdAndUpdate(projectId, updateData);
        }

        const updated = await Task.findById(projectId);

        return NextResponse.json({ message: "Task updated", data: updated });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to update task", error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
