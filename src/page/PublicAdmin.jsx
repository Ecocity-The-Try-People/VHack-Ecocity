import { useState } from "react";
import { Home, FileText, Map, Users } from "lucide-react";
import ProfileModule from "@/modules/ProfileModule";
import PolicyManagement from "@/modules/PolicyManagement";
import FeedbackModule from "@/modules/FeedbackModule";
import HomePage from "@/modules/HomePage";
import NavButton from "@/components/NavButton";

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState("home");

  const modules = {
    home: <HomePage setActiveModule={setActiveModule} />,
    policies: <PolicyManagement />,
    feedback: <FeedbackModule />,
    profile: <ProfileModule />,
  };

  return (
    <div className="relative flex min-h-dvh bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="src/assets/Smart-City.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sidebar */}
      <aside className="w-20 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-4 fixed min-h-dvh z-20">
        <NavButton
          icon={<Home className={`w-6 h-6 ${activeModule === "home" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
          onClick={() => setActiveModule("home")}
          isActive={activeModule === "home"}
        />
        <NavButton
          icon={<FileText className={`w-6 h-6 ${activeModule === "policies" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
          onClick={() => setActiveModule("policies")}
          isActive={activeModule === "policies"}
        />
        <NavButton
          icon={<Map className={`w-6 h-6 ${activeModule === "feedback" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
          onClick={() => setActiveModule("feedback")}
          isActive={activeModule === "feedback"}
        />
        <NavButton
          icon={<Users className={`w-6 h-6 ${activeModule === "profile" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`} />}
          onClick={() => setActiveModule("profile")}
          isActive={activeModule === "profile"}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-20 z-20 relative">{modules[activeModule]}</main>
    </div>
  );
}