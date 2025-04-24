import { useState, useRef, useEffect } from "react";

export function ImageViewer({ imageUrl, onClose }) {
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);

  if (!imageUrl) return null;

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-[95vw] max-h-[95vh]">
        <img 
          ref={imageRef}
          src={imageUrl} 
          alt="Full preview" 
          className="max-h-[90vh] max-w-full object-contain"
          style={{ transform: `scale(${scale})` }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Close button using HTML entity */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 p-2 rounded-full text-2xl leading-none"
          aria-label="Close image viewer"
        >
          &times;
        </button>

        {/* Simple zoom controls */}
        {scale > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 rounded-full p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.max(prev - 0.25, 1));
              }}
              className="text-white px-3 py-1 text-sm"
            >
              Zoom Out
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale(1);
              }}
              className="text-white px-3 py-1 text-sm"
            >
              Reset
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.min(prev + 0.25, 3));
              }}
              className="text-white px-3 py-1 text-sm"
            >
              Zoom In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}