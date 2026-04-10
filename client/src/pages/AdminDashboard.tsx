import { useState } from "react";
import { Upload, Plus, Edit2, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

/**
 * Admin Dashboard - Vehicle ERP Management
 * 
 * Features:
 * - Manual vehicle entry
 * - Bulk import via CSV
 * - Inventory management
 * - Order management
 */

interface Vehicle {
  id: number;
  sku: string;
  make: string;
  model: string;
  year: number;
  price: number;
  stock: number;
  region: string;
}

interface BulkImport {
  id: number;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"inventory" | "imports" | "orders">("inventory");
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      sku: "JPN-2024-001",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 24999,
      stock: 5,
      region: "Tokyo",
    },
    {
      id: 2,
      sku: "JPN-2024-002",
      make: "Honda",
      model: "Civic",
      year: 2022,
      price: 19999,
      stock: 3,
      region: "Osaka",
    },
  ]);

  const [bulkImports, setBulkImports] = useState<BulkImport[]>([
    {
      id: 1,
      fileName: "vehicles_batch_001.csv",
      totalRecords: 50,
      successfulRecords: 48,
      failedRecords: 2,
      status: "completed",
      createdAt: "2024-04-10",
    },
    {
      id: 2,
      fileName: "vehicles_batch_002.csv",
      totalRecords: 100,
      successfulRecords: 100,
      failedRecords: 0,
      status: "completed",
      createdAt: "2024-04-09",
    },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    region: "",
    stock: 1,
  });

  const handleAddVehicle = () => {
    if (newVehicle.make && newVehicle.model && newVehicle.price > 0) {
      const vehicle: Vehicle = {
        id: vehicles.length + 1,
        sku: `JPN-${new Date().getFullYear()}-${String(vehicles.length + 1).padStart(3, "0")}`,
        ...newVehicle,
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        region: "",
        stock: 1,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImport: BulkImport = {
        id: bulkImports.length + 1,
        fileName: file.name,
        totalRecords: Math.floor(Math.random() * 100) + 10,
        successfulRecords: 0,
        failedRecords: 0,
        status: "processing",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBulkImports([newImport, ...bulkImports]);
    }
  };

  return (
    <DashboardLayout activeModule="admin">
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage vehicle inventory, imports, and orders</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "inventory"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab("imports")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "imports"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bulk Imports
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Orders
          </button>
        </div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-8">
            {/* Add Vehicle Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add New Vehicle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Make (e.g., Toyota)"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                />
                <Input
                  placeholder="Model (e.g., Camry)"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  type="number"
                  placeholder="Price"
                  value={newVehicle.price}
                  onChange={(e) => setNewVehicle({ ...newVehicle, price: parseFloat(e.target.value) })}
                />
                <Input
                  placeholder="Region"
                  value={newVehicle.region}
                  onChange={(e) => setNewVehicle({ ...newVehicle, region: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={newVehicle.stock}
                  onChange={(e) => setNewVehicle({ ...newVehicle, stock: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddVehicle} className="bg-blue-600 hover:bg-blue-700">
                Add Vehicle
              </Button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Current Inventory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">SKU</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Vehicle</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Year</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Region</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-3 text-sm font-mono text-slate-600">{vehicle.sku}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                          {vehicle.make} {vehicle.model}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600">{vehicle.year}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-green-600">
                          ${vehicle.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vehicle.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {vehicle.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600">{vehicle.region}</td>
                        <td className="px-6 py-3 text-sm flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Imports Tab */}
        {activeTab === "imports" && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Bulk Import Vehicles
              </h2>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">
                  Upload a CSV file with vehicle data (make, model, year, price, region, stock)
                </p>
                <label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    Choose CSV File
                  </Button>
                </label>
              </div>
            </div>

            {/* Import History */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Import History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">File Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Success</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Failed</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkImports.map((imp) => (
                      <tr key={imp.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">{imp.fileName}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{imp.totalRecords}</td>
                        <td className="px-6 py-3 text-sm text-green-600 font-semibold">{imp.successfulRecords}</td>
                        <td className="px-6 py-3 text-sm text-red-600 font-semibold">{imp.failedRecords}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            imp.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : imp.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {imp.status === "completed" && <CheckCircle className="w-3 h-3" />}
                            {imp.status === "processing" && <AlertCircle className="w-3 h-3" />}
                            {imp.status.charAt(0).toUpperCase() + imp.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600">{imp.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Orders</h2>
            <div className="text-center py-12">
              <p className="text-slate-600">No orders yet. Orders will appear here as customers make purchases.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
