import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Project from "@/models/Project";
import { isEmployeeAvailable } from "@/utils/projectUtils";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, description, budget, assignedToManager, assignedToEmployee } = await req.json();

    if (assignedToEmployee && !(await isEmployeeAvailable(assignedToEmployee))) {
        return NextResponse.json({ error: "Employee already has an active project" }, { status: 400 });
    }

    const managerId = assignedToManager?.trim() === "" ? null : assignedToManager;
    const employeeId = assignedToEmployee?.trim() === "" ? null : assignedToEmployee;

    const project = await Project.create({
        name,
        description,
        budget,
        createdBy: user.userId,
        assignedToManager: managerId,
        assignedToEmployee: employeeId,
    });

    return NextResponse.json({ message: "Project Added", project: project });
}

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = jwt.verify(token, process.env.JWT_SECRET!);

    let query = { isDeleted: false } as any;

    if (user.role === "EMPLOYEE") {
        query.assignedToEmployee = user.userId;
    } else if (user.role === "MANAGER") {
        query.$or = [{ assignedToManager: user.userId }, { assignedToManager: { $exists: false } }];
    }

    const projects = await Project.find(query).populate("assignedToManager", "firstName lastName").populate("assignedToEmployee", "firstName lastName");

    return NextResponse.json({ message: "Project Listed", projects: projects });
}
