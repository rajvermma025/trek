"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "EMPLOYEE" | "MANAGER";
    hourlyRate?: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<User>) => void;
    initialData?: Partial<User>;
    role: "EMPLOYEE" | "MANAGER";
}

const localData = {
    firstName: "",
    lastName: "",
    email: "",
    hourlyRate: 10,
};

export default function UserFormModal({ isOpen, onClose, onSave, initialData, role }: Readonly<Props>) {
    const [formData, setFormData] = useState<Partial<User>>({ ...localData });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: name === "hourlyRate" ? +value : value });
    };

    const handleClose = () => {
        setFormData({ ...localData });
        onClose();
    };

    const handleSubmit = () => {
        onSave({ ...formData, role });
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} placement="center" onClose={onClose}>
            <ModalContent>
                <ModalHeader className="text-lg font-medium">
                    {initialData ? "Edit" : "Add"} {role}
                </ModalHeader>
                <ModalBody className="space-y-3">
                    <Input fullWidth isRequired label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <Input fullWidth isRequired label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                    <Input fullWidth isRequired label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    {role === "EMPLOYEE" && (
                        <Input
                            fullWidth
                            isRequired
                            label="Hourly Rate"
                            name="hourlyRate"
                            type="number"
                            value={formData.hourlyRate?.toString() ?? ""}
                            onChange={handleChange}
                        />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleClose}>
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
