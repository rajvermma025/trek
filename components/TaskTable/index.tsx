/* eslint-disable jsx-a11y/no-autofocus */
import { Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import React from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createTask, updateTask } from "@/slices/projectDetailSlice";

interface TaskTableProps {
    id: string;
    setIsAddingTask: (value: boolean) => void;
    isAddingTask: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({ id, setIsAddingTask, isAddingTask }) => {
    const user = useAppSelector((state) => state.auth);
    const { task } = useAppSelector((state) => state.projectDetail);
    const dispatch = useAppDispatch();

    const handleTaskUpdate = (taskId: string, updates: any) => {
        dispatch(updateTask({ taskId, updates }));
    };

    const handleAddTask = async (name: string) => {
        const trimmedName = name.trim();

        if (!trimmedName || !id) {
            setIsAddingTask(false);

            return;
        }

        await dispatch(createTask({ name: trimmedName, projectId: id }));
        setIsAddingTask(false);
    };

    const isEmployee = user.role === "EMPLOYEE";

    return (
        <Table className="w-full table-auto">
            <TableHeader>
                <TableColumn className="p-2 text-left">Name</TableColumn>
                <TableColumn className="p-2 text-left">Status</TableColumn>
                <TableColumn className="p-2 text-left">Hours Spent</TableColumn>
                {isEmployee ? <TableColumn>Action</TableColumn> : <TableColumn> </TableColumn>}
            </TableHeader>
            <TableBody>
                <>
                    {task?.map((data: any) => (
                        <TableRow key={data._id}>
                            <TableCell className="p-2">{data.name}</TableCell>
                            <TableCell className="p-2">
                                {isEmployee ? (
                                    <Select
                                        className="border px-2 py-1 rounded w-full"
                                        defaultSelectedKeys={[data.status]}
                                        disabled={data.status === "COMPLETED"}
                                        onBlur={(e) => {
                                            const newStatus = (e.currentTarget as HTMLSelectElement).value;

                                            if (newStatus !== data.status) {
                                                handleTaskUpdate(data._id, { status: newStatus });
                                            }
                                        }}
                                    >
                                        <SelectItem key="TODO">TODO</SelectItem>
                                        <SelectItem key="INPROGRESS">INPROGRESS</SelectItem>
                                        <SelectItem key="COMPLETED">COMPLETED</SelectItem>
                                    </Select>
                                ) : (
                                    data.status
                                )}
                            </TableCell>
                            <TableCell className="p-2">
                                {Array.isArray(data.hoursSpent) ? `${data.hoursSpent.reduce((sum: number, h: number) => sum + h, 0)} hrs` : "0 hrs"}
                            </TableCell>
                            <TableCell className="p-2">
                                {isEmployee && data.status !== "COMPLETED" ? (
                                    <Input
                                        min={0}
                                        placeholder="Add Hours"
                                        type="number"
                                        onBlur={(e) => {
                                            const value = Number(e.currentTarget.value);

                                            if (value > 0) {
                                                handleTaskUpdate(data._id, { hoursSpent: value });
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const value = Number(e.currentTarget.value);

                                                if (value > 0) {
                                                    handleTaskUpdate(data._id, { hoursSpent: value });
                                                    e.currentTarget.value = "";
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <TableCell> </TableCell>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {isAddingTask && (
                        <TableRow key="add-item">
                            <TableCell className="p-2">
                                <Input
                                    autoFocus
                                    placeholder="New Task Name"
                                    onBlur={(e) => handleAddTask(e.currentTarget.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddTask(e.currentTarget.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    )}
                </>
            </TableBody>
        </Table>
    );
};

export default TaskTable;
