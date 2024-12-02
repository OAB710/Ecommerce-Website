import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    bestSellingProducts: [],
    productData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/dashboard-data');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const productChartData = {
    labels: data.productData.map(d => `${d._id.month}/${d._id.year}`),
    datasets: [
      {
        label: 'Total Products',
        data: data.productData.map(d => d.count),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const bestSellingProductsData = {
    labels: data.bestSellingProducts.map(p => p.name),
    datasets: [
      {
        label: 'Total Sold',
        data: data.bestSellingProducts.map(p => p.totalSold),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h2 className="bold-22 pb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-primary rounded-md">
          <h3 className="bold-18">Total Products</h3>
          <p className="regular-16">{data.totalProducts}</p>
        </div>
        <div className="p-4 bg-primary rounded-md">
          <h3 className="bold-18">Total Users</h3>
          <p className="regular-16">{data.totalUsers}</p>
        </div>
        <div className="p-4 bg-primary rounded-md">
          <h3 className="bold-18">New Users (Last Month)</h3>
          <p className="regular-16">{data.newUsers}</p>
        </div>
        <div className="p-4 bg-primary rounded-md">
          <h3 className="bold-18">Total Orders</h3>
          <p className="regular-16">{data.totalOrders}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="bold-18">Total Products Over the Last 12 Months</h3>
        <Line data={productChartData} />
      </div>
      <div className="mt-8">
        <h3 className="bold-18">Top 5 Best-Selling Products</h3>
        <Bar data={bestSellingProductsData} />
      </div>
    </div>
  );
};

export default Dashboard;