"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Input, Textarea, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";

import ProjectDetails from "@/components/ProjectDetails";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchEmployee, fetchManager } from "@/slices/userSlice";
import { createProject, fetchProjects } from "@/slices/projectSlice";

export default function ProjectsPage() {
    const { employee, manager } = useAppSelector((state) => state.user);
    const user = useAppSelector((state) => state.auth);
    const { projects } = useAppSelector((state) => state.projects);
    const router = useRouter();
    const params = useParams();

    const selectedId = Array.isArray(params.id) ? params.id[0] : undefined;

    const dispatch = useAppDispatch();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        budget: "",
        assignedToManager: "",
        assignedToEmployee: "",
    });

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        if (user.role === "ADMIN" || user.role === "MANAGER") {
            dispatch(fetchManager("MANAGER"));
            dispatch(fetchEmployee("EMPLOYEE"));
        }
    }, [dispatch, user]);

    const handleProjectClick = (id: string) => {
        router.push(`/projects/${id}`);
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        await dispatch(createProject(formData));
        setShowModal(false);
        setFormData({ name: "", description: "", budget: "", assignedToManager: "", assignedToEmployee: "" });
    };

    return (
        <div className="flex h-full w-full">
            <aside className="w-64 border-r p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Projects</h2>
                    {user?.role === "ADMIN" && (
                        <Button size="sm" variant="ghost" onPress={() => setShowModal(true)}>
                            Add
                        </Button>
                    )}
                </div>
                <div className="space-y-2">
                    {projects?.map((project) => (
                        <Button
                            key={project._id}
                            className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                                selectedId === project._id ? "bg-gray-100 font-medium text-black" : ""
                            }`}
                            onPress={() => handleProjectClick(project._id)}
                        >
                            {project.name}
                        </Button>
                    ))}
                </div>
            </aside>

            {selectedId ? (
                <main className="p-6 flex w-full">
                    <ProjectDetails />
                </main>
            ) : (
                <main className="flex-1 p-6 flex items-center justify-center text-gray-500">Select a project to view details.</main>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalContent>
                    <ModalHeader className="text-lg font-medium">Add New Project</ModalHeader>
                    <ModalBody className="space-y-4">
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                        <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} />
                        <Input label="Budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
                        <Select label="Select a Manager" name="assignedToManager" selectedKeys={formData.assignedToManager} onChange={handleChange}>
                            {manager.map((data) => (
                                <SelectItem key={data._id}>{data.firstName + " " + data.lastName}</SelectItem>
                            ))}
                        </Select>
                        <Select label="Select an Employee" name="assignedToEmployee" selectedKeys={formData.assignedToEmployee} onChange={handleChange}>
                            {employee.map((data) => (
                                <SelectItem key={data._id}>{data.firstName + " " + data.lastName}</SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter className="flex justify-end mt-4">
                        <Button color="primary" onPress={handleCreate}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
