import { useState } from 'react';

export const useConfirmationDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        onConfirm: null,
        message: "Are you sure you want to perform this action?",
        title: "Confirm Action"
    });

    const openDialog = (confirmCallback, options = {}) => {
        setIsOpen(true);
        setConfig({
            onConfirm: confirmCallback,
            message: options.message || "Are you sure you want to perform this action?",
            title: options.title || "Confirm Action"
        });
    };

    const closeDialog = () => {
        setIsOpen(false);
        setConfig({
            onConfirm: null,
            message: "",
            title: ""
        });
    };

    const confirm = () => {
        if (config.onConfirm) {
            config.onConfirm();
        }
        closeDialog();
    };

    return {
        isOpen,
        openDialog,
        closeDialog,
        confirm,
        config
    };
};