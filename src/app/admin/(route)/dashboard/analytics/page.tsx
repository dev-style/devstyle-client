"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  fetchMonthlySales,
  fetchMonthlyOrderStats,
  fetchSalesVsOrders,
  fetchTopSellingGoodies,
} from "@/app/admin/controllers/order";
import { fetchGoodiesByCollection } from "@/app/admin/controllers/analytic";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TransactionsDashboard: React.FC = () => {
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [salesVsOrdersData, setSalesVsOrdersData] = useState([]);
  const [topSellingGoodiesData, setTopSellingGoodiesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthlySales = await fetchMonthlySales();
        const monthlyOrderStats = await fetchMonthlyOrderStats();
        const salesVsOrders = await fetchSalesVsOrders();
        const topSellingGoodies = await fetchTopSellingGoodies();
        const goodiesByCollection = await fetchGoodiesByCollection();
        // console.log("monthlySales", monthlySales);
        // console.log("monthlyOrderStats", monthlyOrderStats);
        // console.log("salesVsOrders", salesVsOrders);
        // console.log("topSellingGoodies", topSellingGoodies);
        // console.log("goodiesByCollection", goodiesByCollection);
        setSalesData(monthlySales as any);
        setOrderData(monthlyOrderStats as any);
        setSalesVsOrdersData(salesVsOrders as any);
        setTopSellingGoodiesData(topSellingGoodies as any);
        setCategoryData(goodiesByCollection as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Monthly Sales
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value} FCFA`} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales (FCFA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Monthly Orders
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalOrders"
                stroke="#8884d8"
                name="Total Orders"
              />
              <Line
                type="monotone"
                dataKey="completedOrders"
                stroke="#82ca9d"
                name="Completed Orders"
              />
              <Line
                type="monotone"
                dataKey="cancelledOrders"
                stroke="#ff7300"
                name="Cancelled Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary">Product Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Sales vs Orders Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesVsOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Top Selling Goodies
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingGoodiesData[0]?.topGoodies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalQuantity"
                fill="#8884d8"
                name="Total Quantity"
              />
              <Bar
                yAxisId="right"
                dataKey="totalSales"
                fill="#82ca9d"
                name="Total Sales (FCFA)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDashboard;
