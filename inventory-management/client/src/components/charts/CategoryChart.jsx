import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data }) => {
  if (!data || !data.labels) return <div className="text-center py-4 text-gray-500">No data available</div>;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569'
        }
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#6366f1',
          '#3b82f6',
          '#0ea5e9',
          '#06b6d4',
          '#14b8a6',
          '#10b981',
          '#84cc16',
          '#eab308'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

export default CategoryChart;
