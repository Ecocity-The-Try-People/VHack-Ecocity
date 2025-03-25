import { useState } from 'react';

export const useConfirmationDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);

    const openDialog = (confirmCallback) => {
        setIsOpen(true);
        setOnConfirm(() => confirmCallback);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setOnConfirm(null);
    };

    const confirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        closeDialog();
    };

    return {
        isOpen,
        openDialog,
        closeDialog,
        confirm,
    };
};