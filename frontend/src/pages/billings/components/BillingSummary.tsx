import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 24000, expenses: 18000 },
  { month: "Feb", revenue: 32000, expenses: 22000 },
  { month: "Mar", revenue: 28000, expenses: 20000 },
  { month: "Apr", revenue: 35000, expenses: 24000 },
  { month: "May", revenue: 42000, expenses: 28000 },
  { month: "Jun", revenue: 38000, expenses: 25000 },
];

export const BillingSummary: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#93c5fd"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fill="#fca5a5"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Average Invoice Value</p>
          <p className="text-2xl font-bold text-gray-900">$1,245</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Payment Success Rate</p>
          <p className="text-2xl font-bold text-gray-900">94.2%</p>
        </div>
      </div>
    </div>
  );
};
