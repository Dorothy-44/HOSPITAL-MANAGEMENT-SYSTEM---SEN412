import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ReportCard } from "./components/ReportCard";
import { ReportFilters } from "./components/ReportFilters";
import { ReportChart } from "./components/ReportChart";

interface ReportMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const metrics: ReportMetric[] = [
  {
    title: "Total Patients",
    value: "12,847",
    change: 12.5,
    icon: <Users className="w-6 h-6" />,
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$284,592",
    change: 8.2,
    icon: <DollarSign className="w-6 h-6" />,
    trend: "up",
  },
  {
    title: "Appointments",
    value: "1,423",
    change: -3.1,
    icon: <Calendar className="w-6 h-6" />,
    trend: "down",
  },
  {
    title: "Avg. Wait Time",
    value: "14 min",
    change: -12.3,
    icon: <Activity className="w-6 h-6" />,
    trend: "down",
  },
];

export const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of hospital performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && <ReportFilters onFilter={() => {}} />}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">{metric.icon}</div>
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Patient Admissions</h3>
          <ReportChart type="line" data={[]} />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Department</h3>
          <ReportChart type="bar" data={[]} />
        </Card>
      </div>

      {/* Detailed Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard
          title="Patient Demographics"
          description="Age, gender, and location distribution"
          onClick={() => {}}
        />
        <ReportCard
          title="Appointment Analytics"
          description="No-show rates, peak hours, wait times"
          onClick={() => {}}
        />
        <ReportCard
          title="Revenue Analysis"
          description="Billing, insurance claims, collections"
          onClick={() => {}}
        />
        <ReportCard
          title="Staff Performance"
          description="Doctor utilization, patient satisfaction"
          onClick={() => {}}
        />
        <ReportCard
          title="Inventory Status"
          description="Pharmacy stock levels, expiry tracking"
          onClick={() => {}}
        />
        <ReportCard
          title="Compliance Reports"
          description="HIPAA, quality metrics, audits"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};
