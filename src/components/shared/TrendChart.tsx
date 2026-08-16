import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types/api";
import { formatNumber } from "@/lib/format";

export function TrendChart({
  points,
  context,
  height = 288,
}: {
  points: TrendPoint[];
  context?: string;
  height?: number;
}) {
  return (
    <div className="space-y-2">
      {context ? <p className="text-xs text-muted-foreground">{context}</p> : null}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatNumber(v)}
              width={64}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--color-card-foreground)",
              }}
              formatter={(v) => formatNumber(Number(v))}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
