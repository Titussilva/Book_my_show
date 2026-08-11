import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ data }) => {
  if (!data || !data.labels) return <div className="text-center py-4 text-gray-500">No data available</div>;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : '#e2e8f0' }
      },
      x: {
        ticks: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { display: false }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Stock In',
        data: data.stockIn,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Stock Out',
        data: data.stockOut,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default StockChart;
