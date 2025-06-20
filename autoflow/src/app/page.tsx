"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, CreditCard, ArrowRight, Shield, Clock, Settings, Menu, X } from "lucide-react";
import CustomerPortal from "./components/CustomerPortal";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Car className="h-6 sm:h-8 w-6 sm:w-8 text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">AutoFlow</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-8">
                <Link href="/inventory" className="text-white hover:text-blue-400 transition-colors">
                  Inventory
                </Link>
                <Link href="/apply" className="text-white hover:text-blue-400 transition-colors">
                  Financing
                </Link>
                <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
                  About
                </Link>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/admin/review"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/30 backdrop-blur-sm text-sm"
                  title="Admin Review Panel"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/admin/review"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 flex items-center border border-white/30 backdrop-blur-sm"
                  title="Admin Review Panel"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </motion.div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-blue-400 transition-colors p-2"
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
              className="md:hidden py-4 border-t border-white/20"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/inventory" 
                  className="text-white hover:text-blue-400 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inventory
                </Link>
                <Link 
                  href="/apply" 
                  className="text-white hover:text-blue-400 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Financing
                </Link>
                <Link 
                  href="/about" 
                  className="text-white hover:text-blue-400 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Your Dream Car
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Awaits You
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-4">
              Experience the future of car buying with our seamless digital platform. 
              From browsing to financing to delivery - all in one place.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/inventory"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
              >
                Browse Vehicles
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/apply"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 border border-white/30 backdrop-blur-sm w-full sm:w-auto"
              >
                Get Pre-Approved
                <CreditCard className="h-4 sm:h-5 w-4 sm:w-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">500+</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">24h</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">Fast Approval</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">4.9★</div>
              <div className="text-gray-400 text-xs sm:text-sm md:text-base">Customer Rating</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Customer Portal Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-y border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Customer Portal
            </h2>
            <p className="text-base sm:text-lg text-gray-300 px-4">
              Check your application status and continue your vehicle financing journey from any stage.
            </p>
          </div>

          <CustomerPortal />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Why Choose AutoFlow?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              We&apos;ve revolutionized the car buying experience with cutting-edge technology 
              and customer-first approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Premium Inventory</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Handpicked vehicles from trusted dealers. Every car is inspected and verified 
                for quality and reliability.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Fast Approval</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Get pre-approved in minutes, not hours. Our streamlined process gets you 
                behind the wheel faster.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Secure & Trusted</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Bank-level security and encryption. Your personal and financial information 
                is always protected.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 sm:h-8 w-6 sm:w-8 text-blue-400" />
                <span className="text-xl sm:text-2xl font-bold text-white">AutoFlow</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base max-w-md">
                Revolutionizing the car buying experience with cutting-edge technology and 
                customer-first approach.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/inventory" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Inventory
                </Link>
                <Link href="/apply" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Financing
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  About
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Contact Us
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  FAQ
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Help Center
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 AutoFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
