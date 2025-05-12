
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/lib/i18n';

// Define distinct colors for pie chart segments
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ItemUsageChart = ({ data }) => {
  const { t } = useLanguage();
  // Limit to top 5 items for clarity
  const topItems = data.slice(0, 5);

  const chartData = topItems.map(item => ({
    name: item.name,
    value: parseFloat(item.quantity.toFixed(2)), // Ensure value is a number
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value.toFixed(2)} units`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ItemUsageChart;
  