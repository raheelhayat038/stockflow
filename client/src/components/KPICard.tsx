import { ReactNode } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * KPICard Component
 * 
 * Design Philosophy: Soft Minimalism
 * - Organic rounded corners (1.5rem)
 * - Soft shadows with subtle depth
 * - Teal accent for primary metrics
 * - Smooth hover animations
 */

interface KPICardProps {
  title: string;
  value: string | number;
  label: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  alert?: boolean;
  accentColor?: "teal" | "amber" | "red";
}

export default function KPICard({
  title,
  value,
  label,
  icon,
  trend,
  trendValue,
  alert = false,
  accentColor = "teal",
}: KPICardProps) {
  const accentColors = {
    teal: "from-teal-50 to-cyan-50 border-teal-100",
    amber: "from-amber-50 to-orange-50 border-amber-100",
    red: "from-red-50 to-rose-50 border-red-100",
  };

  const accentIconColors = {
    teal: "text-teal-500",
    amber: "text-amber-500",
    red: "text-red-500",
  };

  return (
    <div
      className={cn(
        "group relative p-6 rounded-3xl border soft-shadow transition-smooth",
        "bg-gradient-to-br hover:soft-shadow-lg hover:scale-105",
        "animate-fade-in-up",
        accentColors[accentColor],
        alert && "animate-pulse-subtle"
      )}
    >
      {/* Background Accent Blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{
          background: accentColor === "teal" ? "#5EEAD4" : accentColor === "amber" ? "#F59E0B" : "#EF4444",
        }}
      />

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-2xl bg-white/60 backdrop-blur-sm", accentIconColors[accentColor])}>
            {icon}
          </div>
          {alert && (
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          )}
        </div>

        {/* Label */}
        <p className="kpi-label mb-2">{label}</p>

        {/* Value */}
        <div className="mb-4">
          <h3 className="kpi-value">{value}</h3>
          <p className="text-sm text-foreground font-medium mt-1">{title}</p>
        </div>

        {/* Trend */}
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : null}
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
              )}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
