"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AllocationData {
  name: string;
  amount: number;
  reasoning?: string;
}

interface AllocationPieChartProps {
  data: AllocationData[];
}

const COLORS = [
  "#4CAF50", // Green
  "#81C784", // Light Green
  "#FFC107", // Amber
  "#FFD700", // Gold
  "#2196F3", // Blue
  "#64B5F6", // Light Blue
  "#9C27B0", // Purple
  "#BA68C8", // Light Purple
];

export function AllocationPieChart({ data }: AllocationPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.amount,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_item, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
