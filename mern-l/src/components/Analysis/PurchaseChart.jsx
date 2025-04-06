import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PurchaseChart = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [topCategory, setTopCategory] = useState(null);
  const [period, setPeriod] = useState("month"); // 'week' or 'month'

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cart")
      .then((response) => {
        const processed = processPurchaseData(response.data);
        setOriginalData(processed);
        updateFilteredData(processed, period);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const processPurchaseData = (purchases) => {
    return purchases.map(({ category, price, createdAt }) => ({
      category,
      price: parseFloat(price),
      date: new Date(createdAt),
    }));
  };

  const updateFilteredData = (data, period) => {
    const summary = {};
    const now = new Date();

    const startDate = new Date(now);
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    data.forEach(({ category, price, date }) => {
      if (date >= startDate) {
        summary[category] = (summary[category] || 0) + price;
      }
    });

    const chartData = Object.keys(summary).map((key) => ({
      category: key,
      total: summary[key],
    }));

    setFilteredData(chartData);
    findTopCategory(chartData);
  };

  const findTopCategory = (data) => {
    if (data.length === 0) {
      setTopCategory(null);
      return;
    }
    const top = data.reduce((prev, current) =>
      current.total > prev.total ? current : prev
    );
    setTopCategory(top);
  };

  const handlePeriodChange = (e) => {
    const selected = e.target.value;
    setPeriod(selected);
    updateFilteredData(originalData, selected);
  };

  return (
    <div>
      <h2>Purchase Analysis</h2>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="period-select">Select Period: </label>
        <select id="period-select" value={period} onChange={handlePeriodChange}>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {topCategory && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
          <strong>📈 Highest Sales ({period === "week" ? "This Week" : "This Month"}):</strong>{" "}
          {topCategory.category} (${topCategory.total.toFixed(2)})
        </div>
      )}
    </div>
  );
};

export default PurchaseChart;
