import React from 'react';
import { X } from 'lucide-react';
import { Button } from "./Button";

export function ConfirmDialog({ open, onClose, onConfirm, message }) {
    if (!open) return null;
    return (
        <div
            className="fixed items-center justify-center flex inset-0 z-[9999] bg-black/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:delay-200 data-[state=closed]:delay-200 py-3"
            onClick={onClose}
        >
            <div className="bg-white p-5 rounded-lg shadow-lg w-100 md:w-150" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <X size={24} className="text-gray-700 cursor-pointer" />
                    </button>
                </div>

                <h2 className="text-lg font-semibold mb-2">Confirm Action</h2>
                <p>{message}</p>
                <div className='flex flex-row justify-end gap-3'>
                    <Button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</Button>
                    <Button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</Button>
                </div>
            </div>
        </div>
    )
};
