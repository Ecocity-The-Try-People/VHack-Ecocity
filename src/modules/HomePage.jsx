import { Card, CardContent } from "@/components/Card";
import { LineChart, BarChart, PieChart } from "@/components/Charts";
import { AlertTriangle, CheckCircle, Trash2, TrafficCone } from "lucide-react";
import { chartData, statsData, systemFeedbacks, userFeedbacks } from "../data";
import { StatCard } from "../components/Card";

export default function HomePage({ setActiveModule }) {

  const stats = statsData;

  return (
    <div className="p-4">
      {/* Overview Section */}
      <div className="mb-5 flex justify-between flex-col">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Smart City Management Dashboard</h2>
            <p className="text-gray-500 break-words whitespace-normal mb-2">
              Monitor key city operations, statistics, and public concerns in real time.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={getIcon(stat.category)} title={stat.category} value={stat.value} />
        ))}
      </div>

      {/* Data Visualization - Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Traffic Congestion Trends</h3>
            <LineChart data={chartData.traffic} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Waste Collection Efficiency</h3>
            <BarChart data={chartData.waste} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Flood Risk Distribution</h3>
            <PieChart data={chartData.flood} />
          </CardContent>
        </Card>

        <div onClick={() => setActiveModule("feedback")} className="cursor-pointer hover:shadow-lg transition-shadow">
          <Card>
            <CardContent>


              <h3 className="font-semibold mb-2">Latest Feedback & Complaints</h3>
              <div className="bg-white p-4 rounded-lg shadow-md">

                {/* System Feedbacks */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-red-600 flex items-center">
                    🚨 System Feedbacks
                  </h2>
                  <div className="border-l-4 border-red-500 pl-3 mt-2 space-y-2">
                    {systemFeedbacks.length > 0 ? (
                      systemFeedbacks.slice(-3).reverse().map((feedback, index) => (
                        <div key={index} className="bg-red-50 p-1.5 rounded">
                          {feedback.message}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No system feedback available.</p>
                    )}
                  </div>
                </div>

                {/* User Feedbacks */}
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 flex items-center">
                    🗣️ User Feedbacks
                  </h2>
                  <div className="border-l-4 border-blue-500 pl-3 mt-2 space-y-2">
                    {userFeedbacks.length > 0 ? (
                      userFeedbacks.slice(-3).reverse().map((feedback, index) => (
                        <div key={index} className="bg-blue-50 p-1.5 rounded">
                          {feedback.message}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No user feedback available.</p>
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
  switch (category) {
    case "Traffic Reports":
      return <TrafficCone size={24} />;
    case "Waste Issues":
      return <Trash2 size={24} />;
    case "Flood Warnings":
      return <AlertTriangle size={24} />;
    case "Resolved Cases":
      return <CheckCircle size={24} />;
    default:
      return null;
  }
}