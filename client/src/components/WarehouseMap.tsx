import { MapPin, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WarehouseMap Component
 * 
 * Design Philosophy: Soft Minimalism
 * - Visual warehouse layout representation
 * - Location-based inventory distribution
 * - Teal accent colors for zones
 * - Smooth animations
 */

interface WarehouseZone {
  id: string;
  name: string;
  location: string;
  inventory: number;
  capacity: number;
  utilization: number;
}

interface WarehouseMapProps {
  zones: WarehouseZone[];
  title?: string;
  backgroundImage?: string;
}

export default function WarehouseMap({
  zones,
  title = "Warehouse Distribution Map",
  backgroundImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663538305020/J5xEkFmwTdNhqDmPPC4J5x/stockflow-warehouse-map-c6p6gPfG3Ywnhb7dYw6R3o.webp",
}: WarehouseMapProps) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-red-500";
    if (utilization >= 75) return "bg-amber-500";
    if (utilization >= 50) return "bg-accent";
    return "bg-green-500";
  };

  const getUtilizationLabel = (utilization: number) => {
    if (utilization >= 90) return "Critical";
    if (utilization >= 75) return "High";
    if (utilization >= 50) return "Moderate";
    return "Low";
  };

  return (
    <div className={cn(
      "p-6 rounded-3xl bg-white border border-border soft-shadow overflow-hidden",
      "animate-fade-in-up"
    )}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "Poppins" }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time warehouse capacity overview</p>
      </div>

      {/* Map Container */}
      <div
        className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-cover bg-center soft-shadow"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Zone Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-4 w-full h-full">
            {zones.slice(0, 4).map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 p-3 transition-smooth hover:bg-white/90 hover:scale-105"
              >
                <div className="text-center">
                  <Package className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-xs font-semibold text-foreground truncate">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">{zone.inventory} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Details */}
      <div className="space-y-3">
        {zones.map((zone, index) => (
          <div
            key={zone.id}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
            className="p-4 rounded-2xl bg-secondary/50 border border-border transition-smooth animate-slide-in-left hover:bg-secondary"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Zone Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <h4 className="font-semibold text-sm text-foreground truncate">{zone.name}</h4>
                  <span className="text-xs text-muted-foreground truncate">({zone.location})</span>
                </div>

                {/* Capacity Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {zone.inventory} / {zone.capacity} units
                    </span>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      "bg-white text-foreground"
                    )}>
                      {Math.round(zone.utilization)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        getUtilizationColor(zone.utilization)
                      )}
                      style={{ width: `${zone.utilization}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <p className={cn(
                  "text-xs font-medium",
                  zone.utilization >= 90 ? "text-red-600" : zone.utilization >= 75 ? "text-amber-600" : "text-green-600"
                )}>
                  {getUtilizationLabel(zone.utilization)} capacity
                </p>
              </div>

              {/* Action */}
              <button className="flex-shrink-0 p-2 rounded-lg hover:bg-white/50 transition-smooth">
                <Truck className="w-4 h-4 text-accent" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Total Capacity: <span className="font-semibold text-foreground">{zones.reduce((sum, z) => sum + z.capacity, 0)} units</span>
        </p>
        <p className="text-xs text-muted-foreground">
          In Use: <span className="font-semibold text-foreground">{zones.reduce((sum, z) => sum + z.inventory, 0)} units</span>
        </p>
      </div>
    </div>
  );
}
