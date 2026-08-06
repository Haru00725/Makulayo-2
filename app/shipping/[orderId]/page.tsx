"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/Navbar";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function ShippingTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("makulayo_orders");
    if (stored) {
      const orders = JSON.parse(stored);
      const found = orders.find((o: any) => o.id === orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return (
      <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 flex items-center justify-center">
        <Navbar />
        <p className="text-xl animate-pulse">Locating shipment...</p>
      </main>
    );
  }

  const steps = [
    { label: "Order Placed", date: new Date(order.date).toLocaleDateString(), icon: Clock, completed: true },
    { label: "Processing", date: "In Progress", icon: Package, completed: true },
    { label: "Shipped", date: "Pending", icon: Truck, completed: false },
    { label: "Delivered", date: "Pending", icon: CheckCircle, completed: false }
  ];

  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 pb-24">
      <Navbar />
      
      <div className="max-w-3xl mx-auto crystal-glass p-12 rounded-3xl">
        <h1 className="text-3xl font-bold mb-2">Tracking #{order.id.toUpperCase()}</h1>
        <p className="text-brand-ivory-muted mb-12">Powered by Shiprocket (Mock)</p>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-white/10" />

          <div className="space-y-12 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className={`flex items-start gap-8 ${step.completed ? "opacity-100" : "opacity-40"}`}>
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? "bg-brand-gold text-black" : "bg-white/10 text-brand-ivory"}`}>
                    <Icon size={24} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-xl mb-1">{step.label}</h3>
                    <p className="text-brand-ivory-muted">{step.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="font-bold text-lg mb-4">Shipping Details</h3>
          <p className="text-brand-ivory-muted">{order.shippingDetails.name}</p>
          <p className="text-brand-ivory-muted whitespace-pre-wrap">{order.shippingDetails.address}</p>
          <p className="text-brand-ivory-muted">{order.shippingDetails.phone}</p>
        </div>
      </div>
    </main>
  );
}
