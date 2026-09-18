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
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  itemPrice: number;
  couponCode: string | null;
  discountAmount: number;
  setCoupon: (code: string | null, discount: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("makulayo_cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const persistItems = (newItems: CartItem[]) => {
    localStorage.setItem("makulayo_cart", JSON.stringify(newItems));
  };

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
      persistItems(newItems);
      return newItems;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((current) => {
      const newItems = current.filter(item => item.product.id !== productId);
      persistItems(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((current) => {
      const newItems = current.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      persistItems(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountAmount(0);
    localStorage.removeItem("makulayo_cart");
  };

  const setCoupon = (code: string | null, discount: number) => {
    setCouponCode(code);
    setDiscountAmount(discount);
  };

  const itemPrice = 1499;
  const subTotal = items.reduce((total, item) => total + (item.quantity * itemPrice), 0);
  const cartTotal = Math.max(0, subTotal - discountAmount);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, setIsCartOpen, itemPrice, couponCode, discountAmount, setCoupon
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
