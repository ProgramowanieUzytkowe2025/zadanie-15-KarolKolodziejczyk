import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TSPChart = ({ history }) => {
  const data = {
    labels: history.map(h => h.iteration),
    datasets: [
      {
        label: 'Długość trasy',
        data: history.map(h => h.length),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Jakość rozwiązania (długość trasy)' }
    },
    scales: {
      x: { title: { display: true, text: 'Iteracja' } },
      y: { title: { display: true, text: 'Długość' } }
    }
  };

  return <Line data={data} options={options} />;
};

export default TSPChart;
