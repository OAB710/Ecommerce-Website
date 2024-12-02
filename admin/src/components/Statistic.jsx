import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Statistic = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState([]);

  const fetchRevenueData = async (selectedYear) => {
    const response = await fetch(`http://localhost:4000/revenue?year=${selectedYear}`);
    const data = await response.json();
    setRevenueData(data);
  };

  useEffect(() => {
    fetchRevenueData(year);
  }, [year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const chartData = {
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

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h4 className="bold-22 uppercase">Revenue Statistics</h4>
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
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Statistic;