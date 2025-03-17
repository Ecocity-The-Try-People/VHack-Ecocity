import { Card, CardContent } from "@/components/Card";
import { LineChart, BarChart, PieChart } from "@/components/Charts";
import { AlertTriangle, CheckCircle, Trash2, TrafficCone } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const data = [
    { category: "Traffic Reports", value: "245 Cases" },
    { category: "Waste Issues", value: "32 Pending" },
    { category: "Flood Warnings", value: "7 Alerts" },
    { category: "Resolved Cases", value: "85%" },
  ];

  const [stats, setStats] = useState(data);

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
            <LineChart data={[10, 20, 30, 25, 35, 50, 60]} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Waste Collection Efficiency</h3>
            <BarChart data={[75, 80, 78, 85, 90]} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Flood Risk Distribution</h3>
            <PieChart data={[30, 40, 20, 10]} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Latest Feedback & Complaints</h3>
            <ul className="list-disc ml-5 text-sm break-words">
              <li>🚧 Road blockage near downtown</li>
              <li>🗑️ Overflowing garbage at Sector 5</li>
              <li>🌊 Flood alert in North Street</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


function StatCard({ icon, title, value }) {
  return (
    <Card className="flex flex-col items-center p-4 min-h-[80px] text-center">
      <div className="text-blue-500">{icon}</div>
      <h4 className="text-lg font-semibold mt-2 break-words">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </Card>
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