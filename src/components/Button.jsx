export function Button({ variant, className, children, onClick }) {
    return (
      <button
        className={`px-4 py-2 rounded-md cursor-pointer hover:opacity-90 ${className} ${
          variant === "ghost" ? "bg-transparent" : "bg-blue-500 text-white"
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  