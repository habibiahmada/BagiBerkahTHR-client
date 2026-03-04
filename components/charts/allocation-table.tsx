"use client";

import { formatCurrency } from "@/lib/utils";

interface AllocationData {
  name: string;
  amount: number;
  reasoning?: string;
  ageLevel?: string;
  status?: string;
  closeness?: string;
}

interface AllocationTableProps {
  data: AllocationData[];
  totalBudget: number;
}

export function AllocationTable({ data, totalBudget }: AllocationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Penerima
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Nominal
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Persentase
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Alasan
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const percentage = ((item.amount / totalBudget) * 100).toFixed(1);
            return (
              <tr
                key={index}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    {item.ageLevel && (
                      <p className="text-xs text-muted-foreground">
                        {item.ageLevel} • {item.status}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-bold text-primary">
                    {formatCurrency(item.amount)}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.reasoning || "-"}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border font-bold">
            <td className="py-3 px-4 text-foreground">Total</td>
            <td className="py-3 px-4 text-primary">
              {formatCurrency(totalBudget)}
            </td>
            <td className="py-3 px-4 text-foreground">100%</td>
            <td className="py-3 px-4"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
