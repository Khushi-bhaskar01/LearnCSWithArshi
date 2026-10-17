
"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export default function PaymentsClient({ purchases }: { purchases: any[] }) {
  
  // Aggregate data for the chart (revenue by day)
  const chartData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    
    purchases.forEach(purchase => {
      if (!purchase.createdAt) return;
      const dateStr = format(parseISO(purchase.createdAt), "MMM dd");
      if (!dataMap[dateStr]) dataMap[dateStr] = 0;
      dataMap[dateStr] += purchase.amount || 0;
    });
    
    return Object.keys(dataMap).map(date => ({
      date,
      revenue: dataMap[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [purchases]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Successful Payments</h2>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue Overview</h3>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`₹${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#E9C46A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No revenue data available
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">User Email</th>
              <th className="p-4 font-semibold text-gray-600">Payment ID</th>
              <th className="p-4 font-semibold text-gray-600">Amount</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No successful payments found</td></tr>
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{purchase.userEmail || "N/A"}</td>
                  <td className="p-4 font-mono text-sm text-gray-500">{purchase.razorpay_payment_id || purchase.id}</td>
                  <td className="p-4 font-medium text-green-600">₹{purchase.amount}</td>
                  <td className="p-4 text-gray-600 text-sm">
                    {purchase.createdAt ? format(parseISO(purchase.createdAt), "PPp") : "Unknown"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
