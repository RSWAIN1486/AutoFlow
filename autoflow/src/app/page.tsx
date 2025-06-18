"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, CreditCard, ArrowRight, Shield, Clock, Settings } from "lucide-react";
import CustomerPortal from "./components/CustomerPortal";

export default function Home() {
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
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">AutoFlow</span>
            </motion.div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
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
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Dream Car
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Awaits You
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of car buying with our seamless digital platform. 
              From browsing to financing to delivery - all in one place.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/inventory"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 text-lg flex items-center gap-2 shadow-lg"
              >
                Browse Vehicles
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/apply"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 text-lg flex items-center gap-2 border border-white/30 backdrop-blur-sm"
              >
                Get Pre-Approved
                <CreditCard className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-gray-400">Fast Approval</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-gray-400">Customer Rating</div>
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
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-y border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Customer Portal
            </h2>
            <p className="text-lg text-gray-300">
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm"
          >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose AutoFlow?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;ve revolutionized the car buying experience with cutting-edge technology 
              and customer-first approach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium Inventory</h3>
              <p className="text-gray-300">
                Handpicked vehicles from trusted dealers. Every car is inspected and verified 
                for quality and reliability.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Approval</h3>
              <p className="text-gray-300">
                Get pre-approved in minutes with our advanced AI-powered credit assessment 
                system. No waiting, no hassle.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Safe</h3>
              <p className="text-gray-300">
                Bank-level security for all your documents and data. Your privacy and 
                security are our top priorities.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who found their dream car through AutoFlow.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/inventory"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 text-lg inline-flex items-center gap-2 shadow-2xl"
            >
              Start Shopping Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">AutoFlow</span>
          </div>
          <p className="text-gray-400">
            © 2024 AutoFlow. Making car buying effortless.
          </p>
        </div>
      </footer>
    </div>
  );
}
