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

const LowStockChart = ({ data }) => {
  if (!data || !data.labels) return <div className="text-center py-4 text-gray-500">No data available</div>;

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : '#e2e8f0' }
      },
      y: {
        ticks: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { display: false }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Quantity',
        data: data.values,
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgb(245, 158, 11)',
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

export default LowStockChart;
