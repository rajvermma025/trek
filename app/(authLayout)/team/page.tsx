"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";

import { addUser, deleteUser, fetchUsers, updateUser } from "@/slices/userSlice";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import UserFormModal from "@/components/UserFormModal";

const ROLES = ["MANAGER", "EMPLOYEE"] as const;

type RoleType = (typeof ROLES)[number];

export default function TeamManagement() {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState<RoleType>("MANAGER");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchUsers(activeTab));
    }, [activeTab, dispatch]);

    const filteredUsers = users.filter((user) => user.role === activeTab);

    return (
        <div className="p-6">
            <Tabs className="w-full" color="primary">
                {ROLES.map((role) => (
                    <Tab key={role} title={`${role.charAt(0) + role.slice(1).toLowerCase()}s`} onClick={() => setActiveTab(role)}>
                        <Card className="rounded-xl shadow">
                            <CardHeader className="flex justify-between items-center p-4">
                                <h2 className="text-lg font-semibold">{activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} List</h2>
                                <Button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onPress={() => {
                                        setEditingUser(null);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Add {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
                                </Button>
                            </CardHeader>

                            <CardBody className="overflow-x-auto p-4">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableColumn className="p-2">First Name</TableColumn>
                                        <TableColumn className="p-2">Last Name</TableColumn>
                                        <TableColumn className="p-2">Email</TableColumn>
                                        {activeTab === "EMPLOYEE" ? <TableColumn className="p-2">Hourly Rate</TableColumn> : <TableColumn> </TableColumn>}
                                        <TableColumn className="p-2">Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell className="p-2">{user.firstName}</TableCell>
                                                <TableCell className="p-2">{user.lastName}</TableCell>
                                                <TableCell className="p-2">{user.email}</TableCell>
                                                {activeTab === "EMPLOYEE" ? (
                                                    <TableCell className="p-2">${user.hourlyRate ?? "-"}</TableCell>
                                                ) : (
                                                    <TableCell> </TableCell>
                                                )}
                                                <TableCell className="p-2 space-x-2">
                                                    <Button
                                                        className="text-blue-600 hover:underline"
                                                        onPress={() => {
                                                            setEditingUser(user);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button className="text-red-600 hover:underline" onPress={() => setDeleteUserId(user._id)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Tab>
                ))}
            </Tabs>

            <UserFormModal
                initialData={editingUser}
                isOpen={isModalOpen}
                role={activeTab}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    if (editingUser?._id) {
                        dispatch(updateUser({ id: editingUser._id, data }));
                    } else {
                        dispatch(addUser(data));
                    }
                }}
            />

            <ConfirmDeleteModal
                isOpen={!!deleteUserId}
                name={users.find((u) => u._id === deleteUserId)?.firstName ?? "this user"}
                onClose={() => setDeleteUserId(null)}
                onConfirm={() => {
                    if (deleteUserId) {
                        dispatch(deleteUser(deleteUserId));
                        setDeleteUserId(null);
                    }
                }}
            />
        </div>
    );
}
