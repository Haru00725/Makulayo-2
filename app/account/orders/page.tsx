"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import Image from "next/image";

type Order = {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("makulayo_orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  if (!user) {
    return (
      <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 flex items-center justify-center">
        <Navbar />
        <p className="text-xl">Please sign in to view your orders.</p>
      </main>
    );
  }

  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Your Orders</h1>

        {!isLoaded ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-white/10 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-white/10 rounded col-span-2"></div>
                  <div className="h-2 bg-white/10 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 crystal-glass rounded-3xl">
            <p className="text-brand-ivory-muted text-lg mb-6">You haven't placed any orders yet.</p>
            <Link href="/" className="text-brand-gold hover:underline">Explore the collection</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="crystal-glass p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-white/10 pb-6 mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Order #{order.id.toUpperCase()}</h3>
                    <p className="text-brand-ivory-muted text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-brand-gold font-bold mb-1">${order.total}</p>
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-brand-ivory-muted text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Link 
                    href={`/shipping/${order.id}`}
                    className="crystal-glass-highlight crystal-glass px-6 py-3 rounded-xl text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all text-sm"
                  >
                    Track Shipment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
