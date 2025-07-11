import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { isEmployeeAvailable } from "@/utils/projectUtils";
import Task from "@/models/Task";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        const updatedFields: Record<string, any> = { ...body };

        // Only update if field is explicitly included in the body
        if ("assignedToManager" in body) {
            updatedFields.assignedToManager = body.assignedToManager?.trim() === "" ? null : body.assignedToManager;
        }

        if ("assignedToEmployee" in body) {
            updatedFields.assignedToEmployee = body.assignedToEmployee?.trim() === "" ? null : body.assignedToEmployee;

            // Check employee availability if assigning one
            if (updatedFields.assignedToEmployee && !(await isEmployeeAvailable(updatedFields.assignedToEmployee))) {
                return NextResponse.json({ error: "Employee already has an active project" }, { status: 400 });
            }
        }

        const updated = await Project.findByIdAndUpdate(id, updatedFields, { new: true })
            .populate("assignedToManager", "firstName lastName")
            .populate("assignedToEmployee", "firstName lastName hourlyRate");

        return NextResponse.json({ message: "Project updated", data: updated });
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Failed to update project",
                error: error.message || "Internal Server Error",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { id } = await params;

    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Project.findByIdAndUpdate(id, { isDeleted: true });

    return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { id } = await params;

    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { name, estimation } = await req.json();

    const task = await Task.create({
        projectId: id,
        name,
        estimation,
        createdBy: user.userId,
    });

    return NextResponse.json(task, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;

    const project = await Project.findById(id)
        .populate("assignedToManager", "firstName lastName")
        .populate("assignedToEmployee", "firstName lastName hourlyRate");

    if (!project) {
        return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const tasks = await Task.find({ projectId: id });

    return NextResponse.json({
        message: "Project Details Listed.",
        data: {
            project,
            tasks,
        },
    });
}
