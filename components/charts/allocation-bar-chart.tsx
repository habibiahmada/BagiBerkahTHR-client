"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AllocationData {
  name: string;
  amount: number;
  reasoning?: string;
}

interface AllocationBarChartProps {
  data: AllocationData[];
}

const COLORS = [
  "#4CAF50",
  "#81C784",
  "#FFC107",
  "#FFD700",
  "#2196F3",
  "#64B5F6",
  "#9C27B0",
  "#BA68C8",
];

export function AllocationBarChart({ data }: AllocationBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    amount: item.amount,
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
          <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
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
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#666" }}
          tickLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          tick={{ fill: "#666" }}
          tickLine={{ stroke: "#e0e0e0" }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
