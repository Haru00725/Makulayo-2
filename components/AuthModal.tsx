"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="crystal-glass p-8 md:p-12 rounded-3xl w-full max-w-md relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose}
                className="text-brand-ivory-muted hover:text-brand-ivory transition-colors text-xl p-2"
              >
                ✕
              </button>
            </div>
            
            <h2 className="text-3xl font-bold text-brand-ivory mb-2">
              {isLogin ? "Welcome Back" : "Join the Few"}
            </h2>
            <p className="text-brand-ivory-muted mb-8">
              {isLogin ? "Enter your email to continue." : "Create an account to explore the collection."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-ivory-muted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold transition-colors placeholder:text-white/20"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full crystal-glass-highlight crystal-glass py-4 rounded-xl text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-brand-ivory-muted hover:text-brand-gold transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
