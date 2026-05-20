import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";

interface ReportFiltersProps {
  onFilter: (filters: ReportFilters) => void;
}

interface ReportFilters {
  dateRange: string;
  department: string;
  reportType: string;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "30d",
    department: "all",
    reportType: "all",
  });

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: "30d",
      department: "all",
      reportType: "all",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filter Reports</h3>
        <button onClick={handleReset}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <Select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom Range</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <Select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
          >
            <option value="all">All Departments</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="emergency">Emergency</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <Select
            value={filters.reportType}
            onChange={(e) =>
              setFilters({ ...filters, reportType: e.target.value })
            }
          >
            <option value="all">All Types</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="clinical">Clinical</option>
            <option value="compliance">Compliance</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
};
