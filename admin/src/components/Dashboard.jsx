import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    bestSellingProducts: [],
    productData: [],
    men: 0,
    women: 0,
    kids: 0,
    tags: {},
    topBuyers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/dashboard-data');
      const result = await response.json();
      setData(result);

      try {
        const menResponse = await fetch("http://localhost:4000/products?category=men");
        const womenResponse = await fetch("http://localhost:4000/products?category=women");
        const kidsResponse = await fetch("http://localhost:4000/products?category=kids");

        const menData = await menResponse.json();
        const womenData = await womenResponse.json();
        const kidsData = await kidsResponse.json();

        const topBuyersResponse = await fetch("http://localhost:4000/top-buyers");
        const topBuyersData = await topBuyersResponse.json();

        setData(prevData => ({
          ...prevData,
          men: menData.products.length,
          women: womenData.products.length,
          kids: kidsData.products.length,
          topBuyers: topBuyersData
        }));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
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

  const pieData = {
    labels: ["Men", "Women", "Kids"],
    datasets: [
      {
        data: [data.men, data.women, data.kids],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const barData = {
    labels: data.topBuyers?.slice(0, 3).map(buyer => buyer.name) || [],
    datasets: [
      {
        label: 'Number of item Purchased',
        data: data.topBuyers?.slice(0, 3).map(buyer => buyer.purchaseCount) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
      <div className="flex justify-center mt-8 space-x-8">
        <div style={{ width: '35%', height: '35%' }}>
          <h3 className="text-center mb-4">Product Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div style={{ width: '45%', height: '45%' }}>
          <h3 className="text-center mb-4">Top 3 Buyers</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;