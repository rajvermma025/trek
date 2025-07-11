"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import TaskTable from "../TaskTable";
import ProjectHeader from "../ProjectHeader";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjectDetail } from "@/slices/projectDetailSlice";

export default function ProjectDetails() {
    const { loading, error } = useAppSelector((state) => state.projectDetail);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const user = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(fetchProjectDetail(id as string));
        }
    }, [id]);

    if (loading) return <p>Loading project details...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const canAddTask = user.role === "MANAGER" || user.role === "ADMIN";

    return (
        <div className="w-full">
            <ProjectHeader id={id as string} />

            <Card className="pt-4 mt-4">
                <CardHeader className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    {canAddTask && (
                        <Button color="secondary" size="sm" onPress={() => setIsAddingTask(true)}>
                            Add Task
                        </Button>
                    )}
                </CardHeader>

                <CardBody>
                    <TaskTable id={id as string} isAddingTask={isAddingTask} setIsAddingTask={setIsAddingTask} />
                </CardBody>
            </Card>
        </div>
    );
}
