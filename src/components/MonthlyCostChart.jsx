
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/currency';
import { useLanguage } from '@/lib/i18n';

const MonthlyCostChart = ({ data }) => {
  const { t } = useLanguage();

  const chartData = data.map(item => ({
    name: item.month,
    [t('purchases')]: item.purchase,
    [t('mealLog')]: item.meal,
  })).reverse(); // Reverse to show oldest month first

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey={t('purchases')} fill="hsl(var(--primary))" />
        <Bar dataKey={t('mealLog')} fill="hsl(var(--accent))" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyCostChart;
  