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
    <div className="flex min-h-dvh bg-gray-100 dark:bg-gray-900">
      <aside className="w-20 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-4 fixed min-h-dvh">
        <NavButton icon={<Home />} onClick={() => setActiveModule("home")} />
        <NavButton icon={<FileText />} onClick={() => setActiveModule("policies")} />
        <NavButton icon={<Map />} onClick={() => setActiveModule("feedback")} />
        <NavButton icon={<Users />} onClick={() => setActiveModule("profile")} />
      </aside>
      <main className="flex-1 p-6 ml-20">{modules[activeModule]}</main>
    </div>
  );
}
