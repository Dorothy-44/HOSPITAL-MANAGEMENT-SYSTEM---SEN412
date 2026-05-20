import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { BillingSummary } from "./components/BillingSummary";
import { useBillingStats } from "@/shared/api/hooks/useBilling";

export const BillingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stats, isLoading } = useBillingStats();

  const summaryCards = [
    {
      title: "Total Revenue",
      value: "$284,592",
      change: "+12.5%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Payments",
      value: "$45,230",
      count: "128 invoices",
      icon: <Clock className="w-6 h-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Overdue",
      value: "$12,450",
      count: "34 invoices",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Collections Rate",
      value: "87.5%",
      change: "+3.2%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const recentInvoices = [
    {
      id: "INV-2024-001",
      patient: "John Smith",
      amount: 1250.0,
      status: "Paid",
      date: "2024-01-15",
    },
    {
      id: "INV-2024-002",
      patient: "Sarah Johnson",
      amount: 850.0,
      status: "Pending",
      date: "2024-01-16",
    },
    {
      id: "INV-2024-003",
      patient: "Mike Wilson",
      amount: 2300.0,
      status: "Overdue",
      date: "2024-01-10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage invoices, payments, and collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${card.bgColor} rounded-lg`}>
                  {card.icon}
                </div>
                <span className={`text-sm font-medium ${card.color}`}>
                  {card.change || card.count}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Billing Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <BillingSummary />
          </Card>
        </div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertCircle className="w-4 h-4 mr-2" />
              View Overdue
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Invoice ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Patient
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">{invoice.patient}</td>
                  <td className="py-3 px-4 font-medium">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
