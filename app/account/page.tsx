"use client";

import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <main className="bg-brand-void min-h-screen selection:bg-brand-gold/30 selection:text-brand-ivory flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crystal-glass p-10 rounded-3xl w-full max-w-md flex flex-col relative overflow-hidden"
        >
          {/* Subtle glow effect behind the form */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-40 bg-brand-gold/10 blur-[80px] rounded-full pointer-events-none" />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            </div>
          ) : user ? (
            <div className="space-y-8 relative z-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
                  <span className="text-2xl font-bold text-brand-gold uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-brand-ivory mb-2">Welcome, {user.name}</h1>
                <p className="text-brand-ivory-muted text-sm">{user.email}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-brand-ivory/10">
                <h3 className="text-lg font-medium text-brand-ivory">Recent Orders</h3>
                <div className="bg-brand-surface/50 rounded-xl p-4 border border-brand-ivory/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-brand-ivory">Order #MAK-8429</span>
                    <span className="text-xs px-2 py-1 bg-brand-gold/20 text-brand-gold rounded-full">In Transit</span>
                  </div>
                  <p className="text-xs text-brand-ivory-muted">MAKULAYO No. 1 - 50ml</p>
                </div>
              </div>

              <button 
                onClick={logout}
                className="w-full py-3 px-4 rounded-xl text-brand-ivory hover:bg-brand-ivory/5 transition-colors font-medium border border-transparent hover:border-brand-ivory/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-brand-ivory mb-2">Sign In</h1>
                <p className="text-brand-ivory-muted text-sm">Access your orders and preferences.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl crystal-glass-highlight bg-brand-ivory/10 text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all mt-4"
                >
                  Continue
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
