import { ResponsiveContainer, Line, LineChart as ReLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart as ReBarChart, Pie, PieChart as RePieChart } from "recharts";

// Line Chart Component
export function LineChart({ data }) {
  return (
    <div className="w-full h-64 md:h-80 mt-10">
      <ResponsiveContainer width="80%" height="80%">
        <ReLineChart data={data.map((val, index) => ({ x: index, y: val }))}>
          <XAxis dataKey="x" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar Chart Component
export function BarChart({ data }) {
  return (
    <div className="w-full h-64 md:h-80 mt-10">
      <ResponsiveContainer width="80%" height="80%">
        <ReBarChart data={data.map((val, index) => ({ x: index, y: val }))}>
          <XAxis dataKey="x" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#82ca9d" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data }) {
  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data.map((val, index) => ({ name: `Zone ${index + 1}`, value: val }))}
            cx="50%"
            cy="50%"
            outerRadius="70%"
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
