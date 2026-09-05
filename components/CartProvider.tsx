"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isFirstOrder: boolean;
  itemPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("makulayo_cart");
    if (stored) setItems(JSON.parse(stored));

    const orders = localStorage.getItem("makulayo_orders");
    if (orders) {
      const parsedOrders = JSON.parse(orders);
      if (parsedOrders.length > 0) {
        setIsFirstOrder(false);
      }
    }
  }, []);

  const addToCart = (product: Product) => {
    setItems((current) => {
      const existing = current.find(item => item.product.id === product.id);
      let newItems;
      if (existing) {
        newItems = current.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...current, { product, quantity: 1 }];
      }
      localStorage.setItem("makulayo_cart", JSON.stringify(newItems));
      return newItems;
    });
    setIsCartOpen(true); // Auto open cart when adding
  };

  const removeFromCart = (productId: string) => {
    setItems((current) => {
      const newItems = current.filter(item => item.product.id !== productId);
      localStorage.setItem("makulayo_cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("makulayo_cart");
  };

  const itemPrice = isFirstOrder ? 1349 : 1499;
  const cartTotal = items.reduce((total, item) => total + (item.quantity * itemPrice), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, clearCart, cartTotal, cartCount, isCartOpen, setIsCartOpen, isFirstOrder, itemPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
