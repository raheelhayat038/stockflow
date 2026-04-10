import { ReactNode } from "react";
import { BarChart3, Box, MapPin, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DashboardLayout Component
 * 
 * Design Philosophy: Soft Minimalism
 * - Sidebar with navigation modules
 * - Organic rounded corners (1.5rem radius)
 * - Soft shadows and gentle transitions
 * - Sage green accent colors
 */

interface DashboardLayoutProps {
  children: ReactNode;
  activeModule?: string;
  onModuleChange?: (module: string) => void;
}

export default function DashboardLayout({
  children,
  activeModule = "overview",
  onModuleChange,
}: DashboardLayoutProps) {
  const modules = [
    {
      id: "overview",
      label: "Overview",
      icon: TrendingUp,
      description: "Dashboard & KPIs",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Box,
      description: "Stock Management",
    },
    {
      id: "warehouse",
      label: "Warehouse",
      icon: MapPin,
      description: "Location & Distribution",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Reports & Insights",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configuration",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-border soft-shadow transition-smooth">
        <div className="p-8">
          {/* Logo & Title */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-teal-400 flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Poppins" }}>
                StockFlow
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Inventory Management</p>
          </div>

          {/* Navigation Modules */}
          <nav className="space-y-2">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => onModuleChange?.(module.id)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-smooth flex items-start gap-3 group",
                    "animate-slide-in-left",
                    isActive
                      ? "bg-secondary text-accent"
                      : "text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 mt-0.5 transition-smooth",
                      isActive ? "text-accent" : "text-muted-foreground group-hover:text-accent"
                    )}
                  />
                  <div>
                    <div className="font-semibold text-sm" style={{ fontFamily: "Poppins" }}>
                      {module.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {module.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-8 right-8 p-4 bg-secondary rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Pro Tip:</span> Use keyboard shortcuts to navigate faster.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
