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

export function StatCard({ icon, title, value }) {
  return (
    <Card className="flex flex-col items-center p-4 min-h-[80px] text-center">
      <div className="text-blue-500">{icon}</div>
      <h4 className="text-lg font-semibold mt-2 break-words">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </Card>
  );
}