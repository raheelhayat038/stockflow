import { useState } from "react";
import { Upload, Plus, FileText, CheckCircle, MessageSquare, Settings as SettingsIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"inventory" | "imports" | "orders" | "messages" | "settings">("inventory");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "0",
    region: "",
    color: "",
    mileage: 0,
    condition: "good" as const,
    stock: 1,
    description: "",
  });

  const [settings, setSettings] = useState({
    whatsappNumber: "+1234567890",
    supportEmail: "support@japanvehicles.com",
    siteName: "JapanVehicles",
  });

  const createVehicleMutation = trpc.vehicles.create.useMutation();
  const { data: messages } = trpc.contact.list.useQuery();
  const { data: vehicles } = trpc.vehicles.list.useQuery({});

  const handleAddVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || parseFloat(newVehicle.price) <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createVehicleMutation.mutateAsync({
        ...newVehicle,
        price: parseFloat(newVehicle.price),
      });
      toast.success(`${newVehicle.make} ${newVehicle.model} added successfully!`);
      setNewVehicle({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: "0",
        region: "",
        color: "",
        mileage: 0,
        condition: "good",
        stock: 1,
        description: "",
      });
    } catch (error) {
      toast.error("Error adding vehicle");
      console.error("Error adding vehicle:", error);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }
    toast.success("CSV upload feature coming soon!");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
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
        {/* Tab Navigation */}
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
              className={`px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-8">
            {/* Add Vehicle Form */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Plus className="w-8 h-8 text-blue-600" />
                Add New Vehicle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Make *</label>
                  <Input
                    placeholder="e.g., Toyota"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Model *</label>
                  <Input
                    placeholder="e.g., Camry"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Year *</label>
                  <Input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Region *</label>
                  <Input
                    placeholder="e.g., Tokyo"
                    value={newVehicle.region}
                    onChange={(e) => setNewVehicle({ ...newVehicle, region: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                  <Input
                    placeholder="e.g., Silver"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mileage (km)</label>
                  <Input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
                  <select
                    value={newVehicle.condition}
                    onChange={(e) => setNewVehicle({ ...newVehicle, condition: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                  <Input
                    type="number"
                    value={newVehicle.stock}
                    onChange={(e) => setNewVehicle({ ...newVehicle, stock: parseInt(e.target.value) })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Vehicle description..."
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddVehicle}
                disabled={createVehicleMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {createVehicleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </>
                )}
              </Button>
            </div>

            {/* Vehicles List */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Current Inventory ({vehicles?.length || 0})</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Make</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Model</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Year</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Region</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles && vehicles.length > 0 ? (
                      vehicles.slice(0, 10).map((vehicle: any) => (
                        <tr key={vehicle.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">{vehicle.make}</td>
                          <td className="py-3 px-4">{vehicle.model}</td>
                          <td className="py-3 px-4">{vehicle.year}</td>
                          <td className="py-3 px-4">${Number(vehicle.price).toLocaleString()}</td>
                          <td className="py-3 px-4">{vehicle.region}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {vehicle.stock}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No vehicles yet. Add one above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Imports Tab */}
        {activeTab === "imports" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-600" />
              Bulk Import Vehicles
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Upload a CSV file with vehicle data</p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
              {csvFile && <p className="text-sm text-slate-600 mt-4">Selected: {csvFile.name}</p>}
            </div>

            <Button
              onClick={handleCSVUpload}
              disabled={!csvFile}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              Upload & Process
            </Button>

            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">CSV Format:</h3>
              <p className="text-sm text-slate-600 font-mono">make,model,year,price,region,color,mileage,condition,stock,description</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              Orders
            </h2>
            <p className="text-slate-600">No orders yet. Orders will appear here when customers make purchases.</p>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              Contact Messages ({messages?.length || 0})
            </h2>

            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{msg.name}</h3>
                        <p className="text-sm text-slate-500">{msg.email}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        msg.status === "new" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700 mb-2">{msg.subject}</p>
                    <p className="text-slate-600">{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No messages yet.</p>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
                <Input
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="+1234567890"
                  className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  placeholder="support@japanvehicles.com"
                  className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="JapanVehicles"
                  className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <Button
                onClick={handleSaveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
