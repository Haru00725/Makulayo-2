"use client";

import { useState } from "react";

type Coupon = {
    id: string;
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    max_uses: number | null;
    current_uses: number;
    is_active: boolean;
};

const emptyForm = {
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    max_uses: null as number | null,
};

const inputClass =
    "w-full border border-[#E4E4E1] rounded-[4px] px-3 py-2 text-[14px] placeholder:text-[#9C9C95] focus:outline-none focus:border-[#2F3A8F]";

export function CouponsAdmin({ initialCoupons }: { initialCoupons: Coupon[] }) {
    const [coupons, setCoupons] = useState(initialCoupons);
    const [showNewForm, setShowNewForm] = useState(false);

    async function deactivate(id: string) {
        if (!confirm("Deactivate this coupon?")) return;
        const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
        if (res.ok) {
            setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: false } : c)));
        }
    }

    async function createCoupon(form: typeof emptyForm) {
        const res = await fetch("/api/admin/coupons", {
            method: "POST",
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.coupon) {
            setCoupons((prev) => [data.coupon, ...prev]);
            setShowNewForm(false);
        } else {
            alert(data.error ?? "Create failed");
        }
    }

    return (
        <div>
            <button
                onClick={() => setShowNewForm((v) => !v)}
                className="mb-8 text-[13px] px-4 py-2 rounded-[4px] bg-[#2F3A8F] text-white hover:bg-[#262F73] transition-colors"
            >
                {showNewForm ? "Cancel" : "Add new coupon"}
            </button>

            {showNewForm && (
                <NewCouponForm onCreate={createCoupon} />
            )}

            <div className="border border-[#E4E4E1] rounded-[4px] divide-y divide-[#E4E4E1]">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.id}
                        className={`flex items-center gap-4 px-5 py-4 ${!coupon.is_active ? "opacity-40" : ""}`}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium font-mono">
                                {coupon.code}
                                {!coupon.is_active && (
                                    <span className="text-[12px] text-[#9C9C95] font-normal font-sans"> — inactive</span>
                                )}
                            </p>
                            <p className="text-[13px] text-[#6E6E68]">
                                {coupon.discount_type === "percentage" 
                                    ? `${coupon.discount_value}% off` 
                                    : `₹${coupon.discount_value} off`}
                            </p>
                        </div>
                        <span className="text-[13px] text-[#6E6E68] w-32 text-right">
                            {coupon.current_uses} / {coupon.max_uses ?? "∞"} uses
                        </span>
                        
                        {coupon.is_active && (
                            <button
                                onClick={() => deactivate(coupon.id)}
                                className="text-[13px] px-3 py-1.5 rounded-[4px] border border-[#E4E4E1] hover:bg-[#FAFAF9] text-[#B3261E] transition-colors"
                            >
                                Deactivate
                            </button>
                        )}
                    </div>
                ))}
                {coupons.length === 0 && !showNewForm && (
                    <p className="p-5 text-[14px] text-[#6E6E68]">No coupons yet.</p>
                )}
            </div>
        </div>
    );
}

function NewCouponForm({
    onCreate,
}: {
    onCreate: (form: typeof emptyForm) => void;
}) {
    const [form, setForm] = useState(emptyForm);

    return (
        <div className="border border-[#E4E4E1] rounded-[4px] p-5 mb-6 space-y-3">
            <div className="flex gap-3">
                <input
                    placeholder="Coupon Code — e.g. FESTIVE10"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, "") })}
                    className={inputClass}
                />
            </div>
            <div className="flex gap-3">
                <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                    className={`${inputClass} w-40`}
                >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <input
                    type="number"
                    placeholder={form.discount_type === "percentage" ? "Discount %" : "Discount ₹"}
                    value={form.discount_value || ""}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
                <input
                    type="number"
                    placeholder="Max Uses (leave empty for ∞)"
                    value={form.max_uses || ""}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })}
                    className={`${inputClass} w-52`}
                />
            </div>
            
            <button
                onClick={() => onCreate(form)}
                disabled={!form.code || !form.discount_value}
                className="text-[13px] px-4 py-2 rounded-[4px] bg-[#2F3A8F] text-white disabled:opacity-50"
            >
                Create coupon
            </button>
        </div>
    );
}
