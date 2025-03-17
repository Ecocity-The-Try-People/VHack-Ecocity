import { Line, LineChart as ReLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart as ReBarChart, Pie, PieChart as RePieChart } from "recharts";

// Line Chart Component
export function LineChart({ data }) {
  return (
    <ReLineChart width={300} height={200} data={data.map((val, index) => ({ x: index, y: val }))}>
      <XAxis dataKey="x" />
      <YAxis />
      <CartesianGrid stroke="#ccc" />
      <Tooltip />
      <Line type="monotone" dataKey="y" stroke="#8884d8" />
    </ReLineChart>
  );
}

// Bar Chart Component
export function BarChart({ data }) {
  return (
    <ReBarChart width={300} height={200} data={data.map((val, index) => ({ x: index, y: val }))}>
      <XAxis dataKey="x" />
      <YAxis />
      <CartesianGrid stroke="#ccc" />
      <Tooltip />
      <Bar dataKey="y" fill="#82ca9d" />
    </ReBarChart>
  );
}

// Pie Chart Component
export function PieChart({ data }) {
  return (
    <RePieChart width={300} height={200}>
      <Pie data={data.map((val, index) => ({ name: `Zone ${index + 1}`, value: val }))} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
    </RePieChart>
  );
}