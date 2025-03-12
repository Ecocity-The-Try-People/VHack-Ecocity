export function Card({ children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg w-full min-h-[80px] break-words">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return (
    <div className="text-gray-700 dark:text-gray-200 break-words whitespace-normal">
      {children}
    </div>
  );
}
