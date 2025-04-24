// components/DialogClose.jsx
import { IconButton } from "@mui/material";
import { X } from "lucide-react";

export function DialogClose({ onClose, className }) {
  return (
    <IconButton
      aria-label="close"
      onClick={onClose}
      className={className}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }
      }}
    >
      <X size={24} />
    </IconButton>
  );
}