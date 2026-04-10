import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ReorderAlerts Component
 * 
 * Design Philosophy: Soft Minimalism
 * - List of reorder threshold alerts
 * - Color-coded severity (red for critical, amber for warning)
 * - Smooth animations and transitions
 * - Organic rounded corners
 */

interface Alert {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  reorderThreshold: number;
  severity: "critical" | "warning" | "info";
  status: "pending" | "ordered" | "acknowledged";
}

interface ReorderAlertsProps {
  alerts: Alert[];
  title?: string;
}

export default function ReorderAlerts({
  alerts,
  title = "Reorder Threshold Alerts",
}: ReorderAlertsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ordered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Ordered
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            Acknowledged
          </span>
        );
    }
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
        <p className="text-sm text-muted-foreground mt-1">
          {alerts.length} item{alerts.length !== 1 ? "s" : ""} below reorder threshold
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={alert.id}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              className={cn(
                "p-4 rounded-2xl border transition-smooth animate-slide-in-left",
                "hover:soft-shadow-lg hover:scale-102",
                getSeverityColor(alert.severity),
                alert.severity === "critical" && "animate-pulse-subtle"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground truncate">
                          {alert.productName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          SKU: <span className="font-mono">{alert.sku}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Current: </span>
                        <span className="font-semibold text-foreground">{alert.currentStock} units</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threshold: </span>
                        <span className="font-semibold text-foreground">{alert.reorderThreshold} units</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {getStatusBadge(alert.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">All stock levels healthy</p>
            <p className="text-xs text-muted-foreground mt-1">No items below reorder threshold</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium text-sm transition-smooth hover:opacity-90">
            Review & Place Orders
          </button>
        </div>
      )}
    </div>
  );
}
