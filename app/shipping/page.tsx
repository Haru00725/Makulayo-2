"use client";

import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Box } from "lucide-react";

// Mock database for tracking statuses
const MOCK_SHIPMENTS: Record<string, any> = {
  "MAK-123456": {
    status: "in-transit",
    items: ["MAKULAYO No. 1 - 50ml"],
    estimatedDelivery: "Aug 12, 2026",
    carrier: "FedEx",
    steps: [
      { name: "Order Placed", completed: true, date: "Aug 02, 10:00 AM" },
      { name: "Processing", completed: true, date: "Aug 03, 02:30 PM" },
      { name: "In Transit", completed: true, date: "Aug 04, 08:15 AM", current: true },
      { name: "Out for Delivery", completed: false, date: "Pending" },
      { name: "Delivered", completed: false, date: "Pending" }
    ]
  },
  "MAK-999999": {
    status: "delivered",
    items: ["MAKULAYO No. 5 - 100ml", "MAKULAYO Discovery Set"],
    estimatedDelivery: "Delivered on Aug 01, 2026",
    carrier: "UPS",
    steps: [
      { name: "Order Placed", completed: true, date: "Jul 25, 09:12 AM" },
      { name: "Processing", completed: true, date: "Jul 26, 11:00 AM" },
      { name: "In Transit", completed: true, date: "Jul 28, 04:20 PM" },
      { name: "Out for Delivery", completed: true, date: "Aug 01, 07:05 AM" },
      { name: "Delivered", completed: true, date: "Aug 01, 01:45 PM", current: true }
    ]
  }
};

export default function ShippingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    setError("");
    setSearchQuery(trackingNumber);

    // Simulate network delay
    setTimeout(() => {
      const data = MOCK_SHIPMENTS[trackingNumber.trim().toUpperCase()];
      if (data) {
        setResult(data);
      } else {
        setResult(null);
        setError("We couldn't find a shipment with that tracking number. (Try MAK-123456)");
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <main className="bg-brand-void min-h-screen selection:bg-brand-gold/30 selection:text-brand-ivory flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center p-6 mt-32 relative z-20 w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-brand-ivory mb-4">Track Your Order</h1>
          <p className="text-brand-ivory-muted text-lg max-w-md mx-auto">
            Enter your Makulayo tracking number below to see the status of your shipment.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full relative mb-16 group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-brand-ivory-muted group-focus-within:text-brand-gold transition-colors" />
          </div>
          <input 
            type="text" 
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full bg-brand-surface/30 backdrop-blur-md border border-brand-ivory/10 rounded-full pl-16 pr-40 py-6 text-lg text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold/50 transition-colors shadow-2xl shadow-black/50"
            placeholder="e.g., MAK-123456"
          />
          <div className="absolute inset-y-2 right-2">
            <button 
              type="submit"
              disabled={isSearching || !trackingNumber.trim()}
              className="h-full px-8 rounded-full crystal-glass-highlight bg-brand-ivory/10 text-brand-gold font-bold tracking-wide hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl text-center w-full"
            >
              {error}
            </motion.div>
          )}

          {result && !error && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full crystal-glass p-8 md:p-10 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-brand-ivory/10 pb-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-ivory mb-1">Order {searchQuery.toUpperCase()}</h2>
                  <p className="text-brand-ivory-muted">{result.carrier} • Estimated Delivery: <span className="text-brand-gold">{result.estimatedDelivery}</span></p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-brand-surface/50 px-4 py-2 rounded-full border border-brand-ivory/5">
                  <Box className="w-5 h-5 text-brand-gold" />
                  <span className="text-sm font-medium text-brand-ivory">{result.items.length} Item{result.items.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-brand-ivory/10 md:left-auto md:top-8 md:right-8 md:bottom-auto md:w-[calc(100%-4rem)] md:h-[2px] md:-translate-y-1/2" />
                
                <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 relative">
                  {result.steps.map((step: any, index: number) => {
                    const isCompleted = step.completed;
                    const isCurrent = step.current;
                    
                    return (
                      <div key={index} className="flex md:flex-col items-center md:items-center relative z-10 w-full md:w-32 group">
                        {/* Icon Node */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mb-0 md:mb-4 transition-colors duration-500
                          ${isCurrent ? 'bg-brand-gold text-brand-void shadow-[0_0_30px_rgba(207,181,114,0.3)]' : 
                            isCompleted ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' : 
                            'bg-brand-surface border border-brand-ivory/10 text-brand-ivory/30'}
                        `}>
                          {index === 0 && <Package className="w-5 h-5" />}
                          {index === 1 && <Box className="w-5 h-5" />}
                          {index === 2 && <Truck className="w-5 h-5" />}
                          {index === 3 && <Truck className="w-5 h-5" />}
                          {index === 4 && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        
                        {/* Desktop connection lines overlay (active state) */}
                        {index < result.steps.length - 1 && isCompleted && (
                          <div className="hidden md:block absolute top-6 left-[50%] w-full h-[2px] bg-brand-gold origin-left transition-transform duration-1000 ease-out" />
                        )}

                        {/* Text */}
                        <div className="ml-6 md:ml-0 text-left md:text-center">
                          <p className={`font-medium mb-1 transition-colors ${isCompleted || isCurrent ? 'text-brand-ivory' : 'text-brand-ivory/40'}`}>
                            {step.name}
                          </p>
                          <p className="text-xs text-brand-ivory-muted/70">{step.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
