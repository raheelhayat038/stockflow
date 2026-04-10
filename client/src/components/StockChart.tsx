import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

/**
 * StockChart Component
 * 
 * Design Philosophy: Soft Minimalism
 * - Teal color palette for bars
 * - Minimal grid lines
 * - Smooth animations on load
 * - Rounded chart container
 */

interface StockChartProps {
  data: Array<{
    category: string;
    stock: number;
    capacity: number;
  }>;
  title?: string;
  height?: number;
}

export default function StockChart({
  data,
  title = "Stock Levels by Category",
  height = 300,
}: StockChartProps) {
  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg soft-shadow border border-border">
          <p className="text-sm font-semibold text-foreground">{payload[0].payload.category}</p>
          <p className="text-sm text-accent font-medium">Stock: {payload[0].value}</p>
          <p className="text-xs text-muted-foreground">Capacity: {payload[0].payload.capacity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "p-6 rounded-3xl bg-white border border-border soft-shadow",
      "animate-fade-in-up"
    )}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "Poppins" }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Current inventory distribution across categories</p>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5EEAD4" />
                <stop offset="100%" stopColor="#2DD4BF" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E8" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: "#718096", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#718096", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="stock"
              fill="url(#barGradient)"
              radius={[12, 12, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Updated <span className="font-semibold text-foreground">2 minutes ago</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#5EEAD4" }} />
          <span className="text-xs text-muted-foreground">Current Stock</span>
        </div>
      </div>
    </div>
  );
}
