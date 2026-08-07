"use client";

import { useAuth, Address } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Tab = "profile" | "orders" | "address" | "cashback";

export default function AccountPage() {
  const { user, login, logout, updateProfile, addAddress, isLoading } = useAuth();
  
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dashboard State
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  
  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Orders State (Mock from local storage)
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Check local storage for mock order history
    const stored = localStorage.getItem("makulayo_orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  // Initialize Profile form when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfileEmail(user.email || "");
      setPhone(user.phone || "");
      setBirthdate(user.birthdate || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email: profileEmail,
      phone,
      birthdate,
      gender,
    });
    alert("Profile updated successfully");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      street,
      city,
      state,
      postalCode,
      country,
    });
    setIsAddingAddress(false);
    setStreet(""); setCity(""); setState(""); setPostalCode(""); setCountry("");
  };

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <h2 className="text-2xl font-serif font-light mb-6 text-brand-ivory">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">First Name</label>
                <input 
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Last Name</label>
                <input 
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Email Address</label>
                <input 
                  type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Phone Number</label>
                <input 
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Birthdate</label>
                <input 
                  type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-ivory-muted font-medium ml-1">Gender</label>
                <select 
                  value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-brand-surface/50 border border-brand-ivory/10 rounded-xl px-4 py-3 text-brand-ivory focus:border-brand-gold/50 outline-none"
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="crystal-glass-highlight bg-brand-ivory/10 px-8 py-3 rounded-xl text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all">
                Save Changes
              </button>
            </div>
          </form>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-light mb-6 text-brand-ivory">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/5">
                <p className="text-brand-ivory-muted text-lg mb-6">You haven't placed any orders yet.</p>
                <Link href="/#collection" className="inline-block crystal-glass-highlight bg-brand-ivory/10 px-8 py-3 rounded-xl text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all">
                  Our Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-white/10 p-6 rounded-2xl bg-white/5">
                    <div className="flex flex-col md:flex-row md:justify-between border-b border-white/10 pb-4 mb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-brand-ivory">Order #{order.id.toUpperCase()}</h3>
                        <p className="text-sm text-brand-ivory-muted">Placed {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-brand-gold font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                        <span className="text-xs uppercase tracking-widest text-brand-ivory-muted">{order.status}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-ivory">{item.product.name}</p>
                            <p className="text-brand-ivory-muted text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "address":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-light text-brand-ivory">Saved Addresses</h2>
              {!isAddingAddress && (
                <button onClick={() => setIsAddingAddress(true)} className="text-brand-gold font-semibold tracking-wide hover:underline text-sm uppercase">
                  + Add Address
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="space-y-4 border border-brand-gold/30 p-6 rounded-2xl bg-brand-gold/5 mb-8">
                <h3 className="text-lg font-medium text-brand-ivory mb-4">New Address</h3>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ivory-muted">Street</label>
                  <input type="text" required value={street} onChange={e => setStreet(e.target.value)} className="w-full bg-brand-surface/80 border border-brand-ivory/10 rounded-xl px-4 py-2 outline-none focus:border-brand-gold/50 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ivory-muted">City</label>
                    <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full bg-brand-surface/80 border border-brand-ivory/10 rounded-xl px-4 py-2 outline-none focus:border-brand-gold/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ivory-muted">State/Province</label>
                    <input type="text" required value={state} onChange={e => setState(e.target.value)} className="w-full bg-brand-surface/80 border border-brand-ivory/10 rounded-xl px-4 py-2 outline-none focus:border-brand-gold/50 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ivory-muted">Postal Code</label>
                    <input type="text" required value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full bg-brand-surface/80 border border-brand-ivory/10 rounded-xl px-4 py-2 outline-none focus:border-brand-gold/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ivory-muted">Country</label>
                    <input type="text" required value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-brand-surface/80 border border-brand-ivory/10 rounded-xl px-4 py-2 outline-none focus:border-brand-gold/50 text-white" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="crystal-glass-highlight bg-brand-ivory/10 px-6 py-2 rounded-xl text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all">Save</button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 py-2 rounded-xl text-brand-ivory-muted hover:text-white transition-all">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map(addr => (
                  <div key={addr.id} className="border border-white/10 p-6 rounded-2xl bg-white/5">
                    <p className="text-brand-ivory">{addr.street}</p>
                    <p className="text-brand-ivory-muted">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-brand-ivory-muted">{addr.country}</p>
                  </div>
                ))
              ) : (
                !isAddingAddress && <p className="text-brand-ivory-muted">No addresses saved yet.</p>
              )}
            </div>
          </div>
        );

      case "cashback":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-light mb-6 text-brand-ivory">Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center text-center">
                <p className="text-sm uppercase tracking-widest text-brand-ivory-muted mb-2">Total Amount Spent</p>
                <p className="text-4xl font-serif font-light text-brand-ivory">₹{user.totalSpent?.toLocaleString('en-IN') || "0"}</p>
              </div>
              <div className="border border-brand-gold/30 p-8 rounded-3xl bg-gradient-to-br from-brand-gold/10 to-transparent flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-[50px] rounded-full pointer-events-none" />
                <p className="text-sm uppercase tracking-widest text-brand-ivory-muted mb-2">Makulayo Cashback</p>
                <p className="text-4xl font-serif font-light text-brand-gold">₹{user.cashbackEarned?.toLocaleString('en-IN') || "0"}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="bg-brand-void min-h-screen selection:bg-brand-gold/30 selection:text-brand-ivory flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 mt-32 relative z-20 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : user ? (
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="crystal-glass p-8 rounded-3xl mb-8 text-center">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
                  <span className="text-xl font-bold text-brand-gold uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-xl font-serif text-brand-ivory mb-1">Hi, {user.name}</h1>
                <button onClick={logout} className="text-xs text-brand-ivory-muted hover:text-brand-gold uppercase tracking-widest mt-2">Sign Out</button>
              </div>

              <nav className="flex flex-col space-y-2">
                {[
                  { id: "profile", label: "Profile" },
                  { id: "orders", label: "Orders" },
                  { id: "address", label: "Address Book" },
                  { id: "cashback", label: "Cashback" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`text-left px-6 py-4 rounded-xl font-medium tracking-wide transition-all ${
                      activeTab === tab.id 
                        ? "bg-white/10 text-brand-gold" 
                        : "text-brand-ivory-muted hover:bg-white/5 hover:text-brand-ivory"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 crystal-glass p-8 md:p-12 rounded-3xl">
              {renderTabContent()}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full pt-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="crystal-glass p-10 rounded-3xl w-full max-w-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-40 bg-brand-gold/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-serif font-light tracking-tight text-brand-ivory mb-2">Sign In</h1>
                  <p className="text-brand-ivory-muted text-sm">Access your profile and orders.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
