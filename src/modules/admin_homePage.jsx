import { Card, CardContent } from "@/components/Card";
import { LineChart, BarChart, PieChart } from "@/components/Charts";
import { AlertTriangle, CheckCircle, Trash2, TrafficCone } from "lucide-react";
import { chartData, statsData, systemFeedbacks, userFeedbacks } from "../data";
import { StatCard } from "../components/Card";
import useDarkMode from "../hooks/DarkMode";

export default function HomePage({ setActiveModule }) {
  const stats = statsData;
  const isDarkMode = useDarkMode();

  // Style variables for consistency
  const cardStyle = `rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
    isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
  } border backdrop-blur-sm`;

  return (
    <div className="p-4">
      <div className={`fixed inset-0 -z-10 ml-20 ${
        isDarkMode ? "bg-[hsla(180,0%,10%,0.8)]" : "bg-[hsla(0,0%,100%,0.8)]"
      }`} />
      
      {/* Header Card */}
      <div className="mb-5">
        <Card className={cardStyle}>
          <CardContent>
            <h2 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Smart City Management Dashboard
            </h2>
            <p className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } break-words whitespace-normal mb-2`}>
              Monitor key city operations, statistics, and public concerns in real time.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            icon={getIcon(stat.category)} 
            title={stat.category} 
            value={stat.value} 
            darkMode={isDarkMode} 
          />
        ))}
      </div>

      {/* Charts and Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Traffic Chart */}
        <Card className={cardStyle}>
          <CardContent>
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Traffic Congestion Trends
            </h3>
            <LineChart data={chartData.traffic} darkMode={isDarkMode} />
          </CardContent>
        </Card>

        {/* Waste Chart */}
        <Card className={cardStyle}>
          <CardContent>
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Waste Collection Efficiency
            </h3>
            <BarChart data={chartData.waste} darkMode={isDarkMode} />
          </CardContent>
        </Card>

        {/* Flood Chart */}
        <Card className={cardStyle}>
          <CardContent>
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Flood Risk Distribution
            </h3>
            <PieChart data={chartData.flood} darkMode={isDarkMode} />
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <div 
          onClick={() => setActiveModule("feedback")} 
          className={`cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg ${
            isDarkMode ? "bg-gray-800/90" : "bg-white/90"
          } backdrop-blur-sm`}
        >          
          <Card className="h-full">
            <CardContent>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}>
                Latest Feedback & Complaints
              </h3>
              <div className={`p-4 rounded-lg shadow-md ${
                isDarkMode ? "bg-gray-700/90 border-gray-600" : "bg-gray-100/90 border-gray-200"
              } border`}>              
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold flex items-center ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}>
                    🚨 System Feedbacks
                  </h2>
                  <div className={`border-l-4 pl-3 mt-2 space-y-2 ${
                    isDarkMode ? "text-gray-100 border-red-500" : "text-gray-800 border-red-500"
                  }`}>
                    {systemFeedbacks.length > 0 ? (
                      systemFeedbacks.slice(-3).reverse().map((feedback, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded ${
                            isDarkMode ? "bg-red-900/50" : "bg-red-100"
                          }`}
                        >
                          {feedback.message}
                        </div>
                      ))
                    ) : (
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        No system feedback available.
                      </p>
                    )}
                  </div>
                </div>

                {/* User Feedbacks */}
                <div>
                  <h2 className={`text-lg font-semibold flex items-center ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                    🗣️ User Feedbacks
                  </h2>
                  <div className={`border-l-4 pl-3 mt-2 space-y-2 ${
                    isDarkMode ? "text-gray-100 border-blue-500" : "text-gray-800 border-blue-500"
                  }`}>
                    {userFeedbacks.length > 0 ? (
                      userFeedbacks.slice(-3).reverse().map((feedback, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded ${
                            isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                          }`}
                        >
                          {feedback.message}
                        </div>
                      ))
                    ) : (
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        No user feedback available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getIcon(category) {
  const iconProps = {
    size: 24,
    "aria-label": category,
    className: "text-current"
  };

  switch (category) {
    case "Traffic Reports":
      return <TrafficCone {...iconProps} />;
    case "Waste Issues":
      return <Trash2 {...iconProps} />;
    case "Flood Warnings":
      return <AlertTriangle {...iconProps} />;
    case "Resolved Cases":
      return <CheckCircle {...iconProps} />;
    default:
      return null;
  }
}