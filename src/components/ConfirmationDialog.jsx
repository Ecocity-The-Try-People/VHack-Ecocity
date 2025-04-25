import { Button } from "./Button";
import { X } from "lucide-react";

export const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg max-w-md w-full text-white">
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
              onClick={onConfirm}
              variant="destructive"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
        </div>
      </div>
    </div>
  );
};