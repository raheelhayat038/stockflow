import { useState } from "react";
import { Search, MapPin, DollarSign, Zap, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";

/**
 * Home Page - Vehicle E-Commerce Showcase
 * 
 * Public-facing storefront for Japanese vehicle sales
 * Features: Vehicle catalog, filtering by region, search, and shopping cart
 */

interface Vehicle {
  id: number;
  sku: string;
  make: string;
  model: string;
  year: number;
  price: number;
  region: string;
  condition: string;
  imageUrl: string;
  mileage?: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  // Mock vehicle data
  const vehicles: Vehicle[] = [
    {
      id: 1,
      sku: "JPN-2024-001",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 24999,
      region: "Tokyo",
      condition: "excellent",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop",
      mileage: 15000,
    },
    {
      id: 2,
      sku: "JPN-2024-002",
      make: "Honda",
      model: "Civic",
      year: 2022,
      price: 19999,
      region: "Osaka",
      condition: "good",
      imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop",
      mileage: 32000,
    },
    {
      id: 3,
      sku: "JPN-2024-003",
      make: "Nissan",
      model: "Altima",
      year: 2023,
      price: 22999,
      region: "Yokohama",
      condition: "excellent",
      imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=500&h=400&fit=crop",
      mileage: 8000,
    },
    {
      id: 4,
      sku: "JPN-2024-004",
      make: "Mazda",
      model: "CX-5",
      year: 2022,
      price: 26999,
      region: "Kobe",
      condition: "good",
      imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop",
      mileage: 28000,
    },
    {
      id: 5,
      sku: "JPN-2024-005",
      make: "Subaru",
      model: "Outback",
      year: 2023,
      price: 28999,
      region: "Sapporo",
      condition: "excellent",
      imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=500&h=400&fit=crop",
      mileage: 5000,
    },
    {
      id: 6,
      sku: "JPN-2024-006",
      make: "Mitsubishi",
      model: "Outlander",
      year: 2021,
      price: 21999,
      region: "Nagoya",
      condition: "fair",
      imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop",
      mileage: 45000,
    },
  ];

  const regions = ["all", "Tokyo", "Osaka", "Yokohama", "Kobe", "Sapporo", "Nagoya"];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || v.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleAddToCart = (vehicleId: number) => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚗</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">JapanVehicles</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-900">
              <Heart className="w-6 h-6" />
            </button>
            <button className="relative p-2 text-slate-600 hover:text-slate-900">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Premium Japanese Vehicles</h2>
          <p className="text-xl text-blue-100 mb-8">
            Authentic imports from Japan with certified quality and warranty
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">Browse Catalog</Button>
            <Button variant="outline" className="border-white text-white hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "all" ? "All Regions" : region}
                </option>
              ))}
            </select>
            <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
          </div>
        </div>
      </section>

      {/* Vehicle Catalog */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">Available Vehicles</h3>

          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-slate-200 overflow-hidden">
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {vehicle.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {vehicle.make} {vehicle.model}
                    </h4>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {vehicle.region}
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {vehicle.mileage?.toLocaleString()} km
                      </div>
                      <div className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-700 capitalize">
                        {vehicle.condition}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-slate-900">
                          ${vehicle.price.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(vehicle.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Certified Quality</h4>
              <p className="text-slate-600">All vehicles inspected and certified before shipment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Fast Shipping</h4>
              <p className="text-slate-600">Direct imports from Japan with tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Best Prices</h4>
              <p className="text-slate-600">Competitive pricing with warranty included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">About Us</h5>
              <p className="text-slate-400 text-sm">Premium Japanese vehicle imports with certified quality</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Browse Vehicles</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <p className="text-slate-400 text-sm">Email: info@japanvehicles.com</p>
              <p className="text-slate-400 text-sm">Phone: +81-3-XXXX-XXXX</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 JapanVehicles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
