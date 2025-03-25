import useDarkMode from "../hooks/DarkMode.jsx";

export function Card({ children }) {
  const isDarkMode = useDarkMode();

  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 shadow-md rounded-lg w-full min-h-[80px] break-words transition-colors duration-200`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  const isDarkMode = useDarkMode();
  
  return (
    <div className={`${isDarkMode ? "text-gray-200 bg-gray-800" : "text-gray-700 bg-white"} break-words whitespace-normal transition-colors duration-200`}>
      {children}
    </div>
  );
}

export function StatCard({ icon, title, value }) {
  const isDarkMode = useDarkMode();

  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} flex flex-col items-start p-4 min-h-[80px] text-center shadow-md rounded-lg w-full break-words transition-colors duration-200`}>
      <div className="text-blue-500" >{icon}</div>
      <h4 className={`${isDarkMode ? "text-gray-200" : "text-gray-800"} text-lg font-semibold mt-2 break-words transition-colors duration-200`}>{title}</h4>
      <p className={`${isDarkMode ? "text-gray-200" : "text-gray-800"} text-xl font-bold transition-colors duration-200`}>{value}</p>
    </div>
  );
}