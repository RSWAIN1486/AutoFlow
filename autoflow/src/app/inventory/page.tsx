"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Search, 
  ArrowRight, 
  Calendar, 
  Fuel, 
  Settings,
  Heart,
  Eye,
  Shield,
  CheckCircle,
  Star,
  Menu,
  X
} from 'lucide-react';
import { mockVehicles, Vehicle } from '@/lib/mockData';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'electric') return matchesSearch && vehicle.fuelType === 'Electric';
    if (selectedFilter === 'luxury') return matchesSearch && (vehicle.make === 'BMW' || vehicle.make === 'Tesla');
    if (selectedFilter === 'affordable') return matchesSearch && vehicle.price < 35000;
    
    return matchesSearch;
  });

  const toggleFavorite = (vehicleId: string) => {
    setFavorites(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Car className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">AutoFlow</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/inventory" className="text-blue-600 font-semibold">
                Inventory
              </Link>
              <Link href="/apply" className="text-gray-700 hover:text-blue-600 transition-colors">
                Financing
              </Link>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/inventory" 
                  className="text-blue-600 font-semibold px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inventory
                </Link>
                <Link 
                  href="/apply" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Financing
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Premium Vehicle Collection
          </h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
            Discover your perfect vehicle from our curated selection of quality cars
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white shadow-lg py-6 sm:py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filter Buttons and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                {[
                  { id: 'all', label: 'All Vehicles' },
                  { id: 'electric', label: 'Electric' },
                  { id: 'luxury', label: 'Luxury' },
                  { id: 'affordable', label: 'Under $35K' }
                ].map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                      selectedFilter === filter.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>

              <div className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
                {filteredVehicles.length} vehicles found
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedFilter + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VehicleCard 
                  vehicle={vehicle} 
                  isFavorite={favorites.includes(vehicle.id)}
                  onToggleFavorite={() => toggleFavorite(vehicle.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredVehicles.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Car className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function VehicleCard({ vehicle, isFavorite, onToggleFavorite }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Vehicle Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden group">
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`h-3 sm:h-4 w-3 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 sm:p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all"
          >
            <Eye className="h-3 sm:h-4 w-3 sm:w-4" />
          </motion.button>
        </div>

        {/* Badge */}
        {vehicle.fuelType === 'Electric' && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
              Electric
            </span>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-4 sm:p-6">
        {/* Price */}
        <div className="flex justify-between items-start mb-3">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {formatPrice(vehicle.price)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {vehicle.year}
          </div>
        </div>

        {/* Vehicle Info */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
          {vehicle.make} {vehicle.model}
        </h3>

        {/* CarFax/AutoCheck Scores */}
        {(vehicle.carfaxScore || vehicle.autoCheckScore) && (
          <div className="flex gap-2 sm:gap-3 mb-4">
            {vehicle.carfaxScore && (
              <div className="flex items-center bg-blue-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <Shield className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
                <div className="text-xs">
                  <div className="font-semibold text-blue-900">CarFax</div>
                  <div className="text-blue-700">{vehicle.carfaxScore}/100</div>
                </div>
              </div>
            )}
            {vehicle.autoCheckScore && (
              <div className="flex items-center bg-green-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                <div className="text-xs">
                  <div className="font-semibold text-green-900">AutoCheck</div>
                  <div className="text-green-700">{vehicle.autoCheckScore}/100</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Calendar className="h-3 sm:h-4 w-3 sm:w-4 mr-2 text-gray-400" />
            <span>{formatMileage(vehicle.mileage)} miles</span>
          </div>
          {vehicle.transmission && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Settings className="h-3 sm:h-4 w-3 sm:w-4 mr-2 text-gray-400" />
              <span>{vehicle.transmission}</span>
            </div>
          )}
          {vehicle.fuelType && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Fuel className="h-3 sm:h-4 w-3 sm:w-4 mr-2 text-gray-400" />
              <span>{vehicle.fuelType}</span>
            </div>
          )}
          {vehicle.color && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <div 
                className={`h-3 sm:h-4 w-3 sm:w-4 mr-2 rounded-full border border-gray-300`} 
                style={{ backgroundColor: vehicle.color.toLowerCase() }}
              />
              <span>{vehicle.color}</span>
            </div>
          )}
        </div>

        {/* Key Features */}
        {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <Star className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-yellow-500" />
              Key Features
            </h4>
            <div className="space-y-1">
              {vehicle.keyFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-2 text-green-500 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {vehicle.keyFeatures.length > 3 && (
                <div className="text-xs text-blue-600 font-medium">
                  +{vehicle.keyFeatures.length - 3} more features
                </div>
              )}
            </div>
          </div>
        )}

        {/* Apply Now Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/apply?vehicleId=${vehicle.id}`}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Apply Now
            <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
} 