import { useState } from "react";
import { Search, MapPin, DollarSign, Heart, ShoppingCart, MessageCircle, Zap, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function StorefrontHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const { data: vehicles, isLoading } = trpc.vehicles.list.useQuery({
    region: selectedRegion === "all" ? undefined : selectedRegion,
    make: searchTerm || undefined,
  });

  const regions = ["all", "Tokyo", "Osaka", "Yokohama", "Kobe", "Sapporo", "Nagoya"];

  const handleAddToCart = (vehicleId: number, vehicleName: string) => {
    setCartCount(cartCount + 1);
    toast.success(`${vehicleName} added to cart!`);
  };

  const toggleFavorite = (vehicleId: number, vehicleName: string) => {
    const isFavorited = favorites.includes(vehicleId);
    setFavorites((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
    toast.success(isFavorited ? `${vehicleName} removed from favorites` : `${vehicleName} added to favorites!`);
  };

  const handleExplore = () => {
    const element = document.getElementById("vehicle-catalog");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-white font-bold text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                JapanVehicles
              </h1>
              <p className="text-xs text-slate-500">Premium Imports</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => toast.info(`${favorites.length} vehicles in favorites`)}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => toast.info(`${cartCount} vehicles in cart`)}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Premium Japanese Vehicles
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up animation-delay-100">
            Authentic imports from Japan with certified quality and warranty
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up animation-delay-200">
            <Button 
              onClick={handleExplore}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Explore Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast.info("Learn more about our vehicles and services")}
              className="border-white text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg cursor-pointer"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Quick shipping worldwide" },
              { icon: Star, title: "Quality Assured", desc: "Certified vehicles only" },
              { icon: DollarSign, title: "Best Prices", desc: "Competitive rates" },
              { icon: TrendingUp, title: "24/7 Support", desc: "Always here to help" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-white border-b border-slate-200 py-8 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 h-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-pointer"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "all" ? "All Regions" : region}
                </option>
              ))}
            </select>
            <Button 
              onClick={() => toast.success("Search applied!")}
              className="bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Vehicle Catalog */}
      <section className="py-16" id="vehicle-catalog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Available Vehicles ({vehicles?.length || 0})
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle: any, idx: number) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden group">
                    <img
                      src={`https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop`}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {vehicle.year}
                    </div>
                    <button
                      onClick={() => toggleFavorite(vehicle.id, `${vehicle.make} ${vehicle.model}`)}
                      className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors cursor-pointer hover:scale-110"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(vehicle.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">
                      {vehicle.make} {vehicle.model}
                    </h4>

                    <div className="space-y-3 mb-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{vehicle.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{vehicle.mileage?.toLocaleString() || "N/A"} km</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full text-xs font-bold text-blue-700 capitalize">
                        {vehicle.condition}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Price</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-2xl font-bold text-slate-900">
                            {Number(vehicle.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(vehicle.id, `${vehicle.make} ${vehicle.model}`)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-slate-600 mb-4">No vehicles found</p>
              <p className="text-slate-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Need Help?</h3>
          <p className="text-green-100 mb-8 text-lg">Chat with our team on WhatsApp for instant support</p>
          <a
            href="https://wa.me/1234567890?text=Hi%20I%20am%20interested%20in%20your%20vehicles"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <MessageCircle className="w-6 h-6" />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4">About Us</h4>
              <p className="text-slate-400">Premium Japanese vehicle imports with quality assurance</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" onClick={() => handleExplore()} className="hover:text-white transition cursor-pointer">Browse Vehicles</a></li>
                <li><a href="/contact" className="hover:text-white transition cursor-pointer">Contact Us</a></li>
                <li><a href="#" onClick={() => toast.info("FAQ coming soon")} className="hover:text-white transition cursor-pointer">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" onClick={() => toast.info("Help center coming soon")} className="hover:text-white transition cursor-pointer">Help Center</a></li>
                <li><a href="#" onClick={() => toast.info("Shipping info coming soon")} className="hover:text-white transition cursor-pointer">Shipping Info</a></li>
                <li><a href="#" onClick={() => toast.info("Returns policy coming soon")} className="hover:text-white transition cursor-pointer">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <p className="text-slate-400 mb-2">Email: info@japanvehicles.com</p>
              <p className="text-slate-400">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 JapanVehicles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
