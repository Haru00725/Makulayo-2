"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  addresses?: Address[];
  totalSpent?: number;

};

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock user
    const storedUser = localStorage.getItem("makulayo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const mockTotalSpent = 15992; // e.g., 8 orders of ₹1,999

    const newUser: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split("@")[0],
      firstName: email.split("@")[0],
      lastName: "",
      phone: "",
      birthdate: "",
      gender: "prefer-not-to-say",
      addresses: [],
      totalSpent: mockTotalSpent,

    };
    setUser(newUser);
    localStorage.setItem("makulayo_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("makulayo_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data, name: data.firstName || user.firstName || user.name };
    setUser(updatedUser);
    localStorage.setItem("makulayo_user", JSON.stringify(updatedUser));
  };

  const addAddress = (address: Omit<Address, "id">) => {
    if (!user) return;
    const newAddress: Address = {
      ...address,
      id: "addr_" + Math.random().toString(36).substring(2, 9),
    };
    const updatedUser = {
      ...user,
      addresses: [...(user.addresses || []), newAddress],
    };
    setUser(updatedUser);
    localStorage.setItem("makulayo_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, addAddress, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
