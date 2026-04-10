import { useState } from "react";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/KPICard";
import StockChart from "@/components/StockChart";
import ReorderAlerts from "@/components/ReorderAlerts";
import WarehouseMap from "@/components/WarehouseMap";

/**
 * Home Page - StockFlow Dashboard
 * 
 * Design Philosophy: Soft Minimalism
 * - Hero section with gradient background
 * - KPI cards with organic shapes
 * - Stock level chart with smooth animations
 * - Reorder alerts list with severity indicators
 * - Warehouse map with distribution overview
 */

export default function Home() {
  const [activeModule] = useState("overview");

  // Mock data for stock levels by category
  const stockData = [
    { category: "Electronics", stock: 2400, capacity: 3000 },
    { category: "Hardware", stock: 1800, capacity: 2500 },
    { category: "Software", stock: 900, capacity: 1200 },
    { category: "Accessories", stock: 1200, capacity: 1500 },
    { category: "Tools", stock: 2100, capacity: 2800 },
    { category: "Supplies", stock: 1500, capacity: 2000 },
  ];

  // Mock data for reorder alerts
  const reorderAlerts = [
    {
      id: "1",
      sku: "SKU-001-A",
      productName: "Industrial Bearing Set",
      currentStock: 45,
      reorderThreshold: 100,
      severity: "critical" as const,
      status: "pending" as const,
    },
    {
      id: "2",
      sku: "SKU-002-B",
      productName: "Hydraulic Pump Assembly",
      currentStock: 120,
      reorderThreshold: 150,
      severity: "warning" as const,
      status: "ordered" as const,
    },
    {
      id: "3",
      sku: "SKU-003-C",
      productName: "Control Panel Module",
      currentStock: 200,
      reorderThreshold: 250,
      severity: "info" as const,
      status: "acknowledged" as const,
    },
    {
      id: "4",
      sku: "SKU-004-D",
      productName: "Electrical Connectors",
      currentStock: 30,
      reorderThreshold: 75,
      severity: "critical" as const,
      status: "pending" as const,
    },
  ];

  // Mock data for warehouse zones
  const warehouseZones = [
    {
      id: "zone-1",
      name: "Zone A - Electronics",
      location: "Building 1, Floor 2",
      inventory: 2400,
      capacity: 3000,
      utilization: 80,
    },
    {
      id: "zone-2",
      name: "Zone B - Hardware",
      location: "Building 1, Floor 1",
      inventory: 1800,
      capacity: 2500,
      utilization: 72,
    },
    {
      id: "zone-3",
      name: "Zone C - Supplies",
      location: "Building 2, Floor 1",
      inventory: 1500,
      capacity: 2000,
      utilization: 75,
    },
    {
      id: "zone-4",
      name: "Zone D - Tools",
      location: "Building 2, Floor 2",
      inventory: 2100,
      capacity: 2800,
      utilization: 75,
    },
  ];

  return (
    <DashboardLayout activeModule={activeModule}>
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
        {/* Hero Section */}
        <div
          className="relative h-64 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663538305020/J5xEkFmwTdNhqDmPPC4J5x/stockflow-hero-bg-ThK62hhmuaBD6rCqSn3Egc.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
            <div className="animate-fade-in-up">
              <h1 className="dashboard-title mb-2">StockFlow Dashboard</h1>
              <p className="text-lg text-slate-700 font-medium">
                Real-time inventory monitoring and warehouse management
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-8 md:px-12 py-12">
          {/* KPI Cards Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6" style={{ fontFamily: "Poppins" }}>
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Total SKUs"
                value="1,247"
                label="Active Products"
                icon={<Package className="w-6 h-6" />}
                trend="up"
                trendValue="+12% from last month"
                accentColor="teal"
              />
              <KPICard
                title="Low Stock Alerts"
                value="4"
                label="Items Below Threshold"
                icon={<AlertTriangle className="w-6 h-6" />}
                alert={true}
                accentColor="red"
              />
              <KPICard
                title="Orders Pending"
                value="12"
                label="Purchase Orders"
                icon={<TrendingUp className="w-6 h-6" />}
                trend="down"
                trendValue="-3 from yesterday"
                accentColor="amber"
              />
            </div>
          </div>

          {/* Charts and Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Stock Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <StockChart data={stockData} />
            </div>

            {/* Quick Stats */}
            <div className="p-6 rounded-3xl bg-white border border-border soft-shadow animate-fade-in-up">
              <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: "Poppins" }}>
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Avg Utilization</p>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Poppins" }}>
                    76%
                  </p>
                  <div className="w-full h-2 bg-white rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-accent to-teal-400 rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Poppins" }}>
                    $2.4M
                  </p>
                  <p className="text-xs text-green-600 mt-2">↑ 8% vs last quarter</p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Warehouse Zones</p>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Poppins" }}>
                    4 Active
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">All zones operational</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reorder Alerts Section */}
          <div className="mb-12">
            <ReorderAlerts alerts={reorderAlerts} />
          </div>

          {/* Warehouse Map Section */}
          <div className="mb-12">
            <WarehouseMap zones={warehouseZones} />
          </div>

          {/* Footer Section */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-secondary to-secondary/50 border border-border text-center animate-fade-in-up">
            <p className="text-sm text-foreground">
              Last updated: <span className="font-semibold">2 minutes ago</span> • 
              Next sync: <span className="font-semibold">in 3 minutes</span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
