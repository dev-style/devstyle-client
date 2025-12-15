"use client";

import { chartData } from "@/app/admin/lib/data";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { google } from "googleapis";
import { getPageData, getWeeklyVisits } from "@/app/admin/lib/googleAnalytics";
import { GoogleAuth } from "google-auth-library";
type Props = {};

const Chart = (props: Props) => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const propertyId = "465712653";
      const analyticsData = await getWeeklyVisits(propertyId);
      const pageData = await getPageData(propertyId);
      // console.log("pageData", pageData);
      // console.log("analyticsData", analyticsData);
    };

    fetchData();
  }, []);

  return (
    <div className="h-[450px] bg-primary p-5 rounded-xl">
      <h2 className=" font-semibold text-text-light mb-5 ">Weekly Recap</h2>
      {/* <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="visit"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="click"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer> */}
    </div>
  );
};

export default Chart;
