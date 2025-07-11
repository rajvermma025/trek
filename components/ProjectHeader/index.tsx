import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";

import CustomCircularProgress from "../CustomCircularProgress";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { assignUsers, updateProjectStatus } from "@/slices/projectDetailSlice";

interface ProjectHeaderProps {
    id: string;
}

const ProjectHeader = ({ id }: ProjectHeaderProps) => {
    const { project, task } = useAppSelector((state) => state.projectDetail);
    const { manager, employee } = useAppSelector((state) => state.user);
    const user = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [assignForm, setAssignForm] = useState({
        managerId: "",
        employeeId: "",
    });

    const handleProjectStatusUpdate = (newStatus: string) => {
        if (project?._id && newStatus !== project.status) {
            dispatch(updateProjectStatus({ projectId: project._id, status: newStatus }));
        }
    };

    const handleAssign = () => {
        dispatch(
            assignUsers({
                projectId: id,
                payload: {
                    assignedToManager: assignForm.managerId,
                    assignedToEmployee: assignForm.employeeId,
                },
            }),
        );
    };

    const totalHours = task?.reduce((sum, t) => {
        return sum + (Array.isArray(t.hoursSpent) ? t.hoursSpent.reduce((s, h) => s + h, 0) : 0);
    }, 0);

    const hourlyRate = project?.assignedToEmployee?.hourlyRate ?? 0;

    const budgetUsed = totalHours * hourlyRate;
    const canAssignManager = user.role === "ADMIN";
    const canAssignEmployee = user.role === "ADMIN" || user.role === "MANAGER";

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex justify-between items-start">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{project?.name}</h2>
                    <p className="text-gray-400">{project?.description}</p>
                </div>
                <div className="w-52">
                    <Select
                        className="rounded px-3 py-1 text-sm shadow-sm"
                        defaultSelectedKeys={[project?.status as string]}
                        onChange={(e) => handleProjectStatusUpdate(e.target.value)}
                    >
                        <SelectItem key="TODO">To Do</SelectItem>
                        <SelectItem key="INPROGRESS">In Progress</SelectItem>
                        <SelectItem key="COMPLETED">Completed</SelectItem>
                    </Select>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex justify-between flex-row items-center">
                <div>
                    <p className="pt-2">Budget: ${project?.budget}</p>
                    <p className="pt-2 text-sm text-gray-500">
                        Budget Used: ${budgetUsed} ({totalHours} hrs x ${hourlyRate}/hr)
                    </p>
                </div>
                <CustomCircularProgress aria-label="Loading..." maxValue={project?.budget as number} value={budgetUsed} />
            </CardBody>
            <Divider />
            <CardFooter className="space-y-2 pt-2 flex justify-between items-center">
                <div className="flex gap-2 items-center w-full">
                    <h3 className="text-lg font-semibold">Manager</h3>
                    {!project?.assignedToManager && canAssignManager ? (
                        <div className="flex gap-4 w-1/2 items-center">
                            <Select
                                defaultSelectedKeys={[assignForm.managerId]}
                                label="Assign Manager"
                                name="managerId"
                                onChange={(e) => setAssignForm({ ...assignForm, managerId: e.target.value })}
                            >
                                {manager.map((m) => (
                                    <SelectItem key={m._id}>{m.firstName + " " + m.lastName}</SelectItem>
                                ))}
                            </Select>
                            <Button color="primary" onPress={handleAssign}>
                                Assign
                            </Button>
                        </div>
                    ) : (
                        <p>
                            {project?.assignedToManager?.firstName ?? "N/A"} {project?.assignedToManager?.lastName ?? ""}
                        </p>
                    )}
                </div>
                <div className="flex gap-2 items-center w-full">
                    <h3 className="text-lg font-semibold">Employee</h3>
                    {!project?.assignedToEmployee && canAssignEmployee ? (
                        <div className="flex gap-4 w-1/2 items-center">
                            <Select
                                defaultSelectedKeys={[assignForm.employeeId]}
                                label="Assign Employee"
                                name="employeeId"
                                onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                            >
                                {employee.map((e) => (
                                    <SelectItem key={e._id}>{e.firstName + " " + e.lastName}</SelectItem>
                                ))}
                            </Select>
                            <Button color="primary" onPress={handleAssign}>
                                Assign
                            </Button>
                        </div>
                    ) : (
                        <p>
                            {project?.assignedToEmployee?.firstName ?? "N/A"} {project?.assignedToEmployee?.lastName ?? ""}
                        </p>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProjectHeader;
