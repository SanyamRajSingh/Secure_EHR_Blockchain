import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function RecordGrowthChart({ records }) {

  const data = [
    { name: "Mon", value: Math.max(records - 4, 0) },
    { name: "Tue", value: Math.max(records - 3, 0) },
    { name: "Wed", value: Math.max(records - 2, 0) },
    { name: "Thu", value: Math.max(records - 1, 0) },
    { name: "Fri", value: records }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Medical Records Growth
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RecordGrowthChart;