import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Statistic = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const fetchRevenueData = async (selectedYear) => {
    const response = await fetch(`http://localhost:4000/revenue?year=${selectedYear}`);
    const data = await response.json();
    setRevenueData(data);
  };

  const fetchOrderData = async (selectedYear) => {
    const response = await fetch(`http://localhost:4000/order-stats?year=${selectedYear}`);
    const data = await response.json();
    setOrderData(data);
  };

  useEffect(() => {
    fetchRevenueData(year);
    fetchOrderData(year);
  }, [year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const revenueChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const orderChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Orders',
        data: orderData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h4 className="bold-22 uppercase">Statistics</h4>
      <div className="mb-3">
        <label className="bold-18 pb-2">Select Year:</label>
        <select value={year} onChange={handleYearChange} className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md">
          {[...Array(10)].map((_, i) => {
            const yearOption = new Date().getFullYear() - i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mt-6">
        <h4 className="bold-18 pb-2">Revenue Over the Last 12 Months</h4>
        <Bar data={revenueChartData} />
      </div>
      <div className="mt-6">
        <h4 className="bold-18 pb-2">Number of Orders Over the Last 12 Months</h4>
        <Bar data={orderChartData} />
      </div>
    </div>
  );
};

export default Statistic;