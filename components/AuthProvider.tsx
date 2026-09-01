"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
    supabaseUser: SupabaseUser | null;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updateProfile: (data: Partial<User>) => void;
    addAddress: (address: Omit<Address, "id">) => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(su: SupabaseUser): User {
    const meta = su.user_metadata || {};
    const fullName = meta.full_name || meta.name || su.email?.split("@")[0] || "";
    const parts = fullName.split(" ");
    return {
        id: su.id,
        email: su.email || "",
        name: fullName,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        phone: meta.phone || "",
        birthdate: meta.birthdate || "",
        gender: meta.gender || "prefer-not-to-say",
        addresses: meta.addresses || [],
        totalSpent: meta.totalSpent || 0,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Get initial session
        supabase.auth.getUser().then(({ data: { user: su } }) => {
            if (su) {
                setSupabaseUser(su);
                setUser(mapSupabaseUser(su));
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setSupabaseUser(session.user);
                setUser(mapSupabaseUser(session.user));
            } else {
                setSupabaseUser(null);
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            return { error: error.message, needsConfirmation: false };
        }

        // If the user object exists but session is null, email confirmation is required
        const needsConfirmation = !!data.user && !data.session;
        return { error: null, needsConfirmation };
    };

    const signIn = async (email: string, password: string) => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const signOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setSupabaseUser(null);
    };

    const resetPassword = async (email: string) => {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            ...data,
            name: data.firstName || user.firstName || user.name,
        };
        setUser(updatedUser);

        // Also update Supabase user metadata
        const supabase = createClient();
        supabase.auth.updateUser({
            data: {
                full_name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
                phone: updatedUser.phone,
                birthdate: updatedUser.birthdate,
                gender: updatedUser.gender,
            },
        });
    };

    const addAddress = (address: Omit<Address, "id">) => {
        if (!user) return;
        const newAddress: Address = {
            ...address,
            id: "addr_" + Math.random().toString(36).substring(2, 9),
        };
        const updatedAddresses = [...(user.addresses || []), newAddress];
        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);

        // Persist to Supabase user metadata
        const supabase = createClient();
        supabase.auth.updateUser({
            data: { addresses: updatedAddresses },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                supabaseUser,
                signUp,
                signIn,
                signOut,
                resetPassword,
                updateProfile,
                addAddress,
                isLoading,
            }}
        >
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
