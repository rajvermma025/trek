import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Project from "@/models/Project";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const token = req.cookies.get("token")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user: any = jwt.verify(token, process.env.JWT_SECRET!);

        const query: any = {};

        if (user.role === "MANAGER") {
            query.assignedToManager = user.userId;
        }

        const projects = await Project.find(query).populate("assignedToEmployee");

        type StatusType = "TODO" | "INPROGRESS" | "COMPLETED";
        const summary = {
            status: {
                TODO: 0,
                INPROGRESS: 0,
                COMPLETED: 0,
            },
            budget: {
                overBudget: 0,
                withinBudget: 0,
            },
            assignment: {
                assigned: 0,
                unassigned: 0,
            },
        };

        for (const proj of projects) {
            const status: StatusType = (proj.status || "TODO") as StatusType;

            summary.status[status]++;

            const tasks = await Task.find({ projectId: proj._id });
            const totalHours = tasks.reduce((acc: number, t: any) => {
                return acc + t.hoursSpent?.reduce?.((a: number, h: number) => a + h, 0);
            }, 0);

            const hourlyRate = proj.assignedToEmployee?.hourlyRate || 0;
            const used = hourlyRate * totalHours;

            if (used > proj.budget) summary.budget.overBudget++;
            else summary.budget.withinBudget++;

            if (proj.assignedToEmployee) summary.assignment.assigned++;
            else summary.assignment.unassigned++;
        }

        return NextResponse.json({ data: summary });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to load dashboard data", error: error.message }, { status: 500 });
    }
}
