import React, { useEffect, useState } from 'react';
//import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    newUsers: 0,
    totalOrders: 0,
    revenue: 0,
    bestSellingProducts: [],
  });

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/dashboard-data');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h2 className="bold-22 pb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-primary rounded-md">
          <h3 className="bold-18">Total Products</h3>
          <p className="regular-16">{data.totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;