import { useState } from "react";
import { Upload, Plus, FileText, CheckCircle, MessageSquare, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"inventory" | "imports" | "orders" | "messages" | "settings">("inventory");

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    region: "",
    color: "",
    mileage: 0,
    condition: "good" as const,
    stock: 1,
    description: "",
  });

  const createVehicleMutation = trpc.vehicles.create.useMutation();
  const { data: messages } = trpc.contact.list.useQuery();
  const { user } = useAuth();

  const handleAddVehicle = async () => {
    if (newVehicle.make && newVehicle.model && newVehicle.price > 0) {
      try {
        await createVehicleMutation.mutateAsync({
          ...newVehicle,
          price: newVehicle.price,
        });
        setNewVehicle({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          price: 0,
          region: "",
          color: "",
          mileage: 0,
          condition: "good",
          stock: 1,
          description: "",
        });
      } catch (error) {
        console.error("Error adding vehicle:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage your vehicle inventory and orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-slate-200">
          {[
            { id: "inventory", label: "Inventory", icon: Plus },
            { id: "imports", label: "Bulk Imports", icon: Upload },
            { id: "orders", label: "Orders", icon: CheckCircle },
            { id: "messages", label: "Messages", icon: MessageSquare },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "inventory" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Plus className="w-8 h-8 text-blue-600" />
                Add New Vehicle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Make</label>
                  <Input
                    placeholder="e.g., Toyota"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Model</label>
                  <Input
                    placeholder="e.g., Camry"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD)</label>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({ ...newVehicle, price: parseFloat(e.target.value) })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Region</label>
                  <select
                    value={newVehicle.region}
                    onChange={(e) => setNewVehicle({ ...newVehicle, region: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Region</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="Osaka">Osaka</option>
                    <option value="Yokohama">Yokohama</option>
                    <option value="Kobe">Kobe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
                  <select
                    value={newVehicle.condition}
                    onChange={(e) => setNewVehicle({ ...newVehicle, condition: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Vehicle description..."
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddVehicle}
                disabled={createVehicleMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all"
              >
                {createVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "imports" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-600" />
              Bulk Import Vehicles
            </h2>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2 text-lg font-semibold">Upload a CSV file with vehicle data</p>
              <p className="text-slate-500 mb-6">Format: make, model, year, price, region, stock, condition, description</p>
              <label>
                <input type="file" accept=".csv" className="hidden" />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 cursor-pointer shadow-lg hover:shadow-xl transition-all">
                  Choose CSV File
                </Button>
              </label>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Recent Orders</h2>
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No orders yet</p>
              <p className="text-slate-500">Orders will appear here as customers make purchases</p>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Contact Messages</h2>
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{msg.name}</h4>
                        <p className="text-sm text-slate-500">{msg.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        msg.status === "new" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 mb-2">{msg.subject}</p>
                    <p className="text-slate-600">{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No messages yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Website Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
                <Input placeholder="+1 (555) 123-4567" className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                <Input placeholder="support@japanvehicles.com" className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
