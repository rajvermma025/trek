// components/ConfirmDeleteModal.tsx
"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, name }: Readonly<ConfirmDeleteModalProps>) {
    return (
        <Modal isOpen={isOpen} placement="center" onClose={onClose}>
            <ModalContent>
                <ModalHeader className="text-lg font-semibold">Confirm Deletion</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="danger" onPress={onConfirm}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
