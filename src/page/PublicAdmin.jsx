import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Home, FileText, Map, Users, LogOut, Recycle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileModule from "@/modules/ProfileModule";
import PolicyManagement from "@/modules/PolicyManagement";
import FeedbackModule from "@/modules/FeedbackModule";
import RecyclePage from "../modules/RecyclePage";
import HomePage from "@/modules/admin_homePage";
import NavButton from "@/components/NavButton";
import { Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const userRole = "Admin";

  const [isDarkMode, setIsDarkMode] = useState(
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.add("transition-colors");
    document.documentElement.classList.add("duration-300");
    
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prevMode) => !prevMode);
    
    setTimeout(() => {
        document.documentElement.classList.remove("transition-colors");
        document.documentElement.classList.remove("duration-300");
    }, 300);
};


  const modules = {
    home: <HomePage setActiveModule={setActiveModule} />,
    policies: <PolicyManagement userRole={userRole} />,
    feedback: <FeedbackModule userRole={userRole} />,
    profile: <ProfileModule userRole={userRole} />,
    recycle: <RecyclePage userRole={userRole} />,
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("isAdminAuthenticated");
      navigate("/");
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }, 800);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getIconClass = (module) =>
    `w-6 h-6 ${activeModule === module ?
      "text-blue-600 dark:text-blue-400" :
      "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-black"}`;

  return (
    <div className={`relative flex min-h-dvh overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="src/assets/videos/Smart-City.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

<aside className={`w-20 shadow-md flex flex-col items-center py-4 fixed top-0 left-0 min-h-dvh z-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex flex-col items-center space-y-4">
          <NavButton
            icon={<Home className={`w-6 h-6 ${activeModule === "home" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`} />}
            onClick={() => setActiveModule("home")}
            isActive={activeModule === "home"}
            aria-label="Home"
          />
          <NavButton
            icon={<FileText className={`w-6 h-6 ${activeModule === "policies" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`} />}
            onClick={() => setActiveModule("policies")}
            isActive={activeModule === "policies"}
            aria-label="Policies"
          />
          <NavButton
            icon={<Map className={`w-6 h-6 ${activeModule === "feedback" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`} />}
            onClick={() => setActiveModule("feedback")}
            isActive={activeModule === "feedback"}
            aria-label="Feedback"
          />
          <NavButton
            icon={<Users className={`w-6 h-6 ${activeModule === "profile" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`} />}
            onClick={() => setActiveModule("profile")}
            isActive={activeModule === "profile"}
            aria-label="Profile"
          />
          <NavButton
            icon={<Recycle className={`w-6 h-6 ${activeModule === "recycle" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`} />}
            onClick={() => setActiveModule("recycle")}
            isActive={activeModule === "recycle"}
            aria-label="recycle"
          />
        </div>

        <div className="mt-auto flex flex-col items-center">
          <NavButton
            icon={
              isDarkMode ? (
                <Moon className={`w-6 h-6 ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} transition-colors duration-200`} />
              ) : (
                <Sun className={`w-6 h-6 ${isDarkMode ? "text-yellow-400 hover:text-yellow-300" : "text-yellow-500 hover:text-yellow-600"} transition-colors duration-200`} />
              )
            }
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-200 mb-4`}
          />

          <NavButton
            icon={<LogOut className={`w-6 h-6 ${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-600"} transition-colors duration-200`} />}
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-200`}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-20 z-20 relative">
        {modules[activeModule]}
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={handleCancelLogout}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Modal Header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                    <LogOut className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ready to leave?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure you want to sign out? You'll need to log in again to access the admin panel.
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleCancelLogout}
                      disabled={isLoggingOut}
                      className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                        hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      disabled={isLoggingOut}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200
                        bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600
                        shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoggingOut ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
