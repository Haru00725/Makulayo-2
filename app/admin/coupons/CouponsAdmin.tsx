"use client";

import { useState } from "react";
import {
    Plus,
    X,
    Tag,
    Percent,
    IndianRupee,
    Ban,
    Save,
    Hash,
    Infinity,
    Loader2,
} from "lucide-react";

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

const cardStyle: React.CSSProperties = {
    background: "#121212",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "14px",
    background: "rgba(255,255,255,0.03)",
    color: "#F2EFE9",
    outline: "none",
    transition: "border-color 200ms ease",
};

const goldBtnStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #C6A15B, #D9B978)",
    color: "#0A0A0A",
    fontWeight: 600,
    fontSize: "13px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "opacity 200ms ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
};

const outlineBtnStyle: React.CSSProperties = {
    background: "transparent",
    color: "#9A958C",
    fontSize: "13px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 200ms ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
};

export function CouponsAdmin({ initialCoupons }: { initialCoupons: Coupon[] }) {
    const [coupons, setCoupons] = useState(initialCoupons);
    const [showNewForm, setShowNewForm] = useState(false);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

    async function deactivate(id: string) {
        if (!confirm("Deactivate this coupon?")) return;
        setDeactivatingId(id);
        const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
        if (res.ok) {
            setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: false } : c)));
        }
        setDeactivatingId(null);
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

    const activeCoupons = coupons.filter((c) => c.is_active);
    const inactiveCoupons = coupons.filter((c) => !c.is_active);

    return (
        <div>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Tag size={16} style={{ color: "#C6A15B" }} />
                    <span className="text-[13px]" style={{ color: "#9A958C" }}>
                        {activeCoupons.length} active · {inactiveCoupons.length} inactive
                    </span>
                </div>
                <button
                    onClick={() => setShowNewForm((v) => !v)}
                    style={showNewForm ? outlineBtnStyle : goldBtnStyle}
                >
                    {showNewForm ? (
                        <>
                            <X size={14} /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus size={14} /> New Coupon
                        </>
                    )}
                </button>
            </div>

            {/* New Coupon Form */}
            {showNewForm && (
                <div style={{ ...cardStyle, padding: "20px", marginBottom: "24px" }}>
                    <h3
                        className="text-[15px] font-medium mb-4 flex items-center gap-2"
                        style={{ color: "#F2EFE9", fontFamily: "var(--font-display)" }}
                    >
                        <Plus size={16} style={{ color: "#C6A15B" }} />
                        Create Coupon
                    </h3>
                    <NewCouponForm onCreate={createCoupon} />
                </div>
            )}

            {/* Coupons List */}
            <div style={cardStyle} className="overflow-hidden">
                {coupons.length === 0 && !showNewForm && (
                    <div className="p-8 text-center">
                        <Tag size={28} style={{ color: "#6B675F", margin: "0 auto 8px" }} />
                        <p className="text-[14px]" style={{ color: "#6B675F" }}>
                            No coupons yet. Create your first one!
                        </p>
                    </div>
                )}
                {coupons.map((coupon, idx) => (
                    <div
                        key={coupon.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 transition-opacity"
                        style={{
                            borderBottom:
                                idx < coupons.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            opacity: coupon.is_active ? 1 : 0.35,
                        }}
                    >
                        {/* Coupon icon */}
                        <div
                            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 hidden sm:flex"
                            style={{
                                background: coupon.is_active
                                    ? "rgba(198,161,91,0.1)"
                                    : "rgba(255,255,255,0.03)",
                            }}
                        >
                            {coupon.discount_type === "percentage" ? (
                                <Percent size={16} style={{ color: coupon.is_active ? "#C6A15B" : "#6B675F" }} />
                            ) : (
                                <IndianRupee size={16} style={{ color: coupon.is_active ? "#C6A15B" : "#6B675F" }} />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p
                                className="text-[14px] font-medium font-mono tracking-wider"
                                style={{ color: coupon.is_active ? "#F2EFE9" : "#9A958C" }}
                            >
                                {coupon.code}
                                {!coupon.is_active && (
                                    <span
                                        className="text-[10px] font-normal font-sans ml-2 px-1.5 py-0.5 rounded"
                                        style={{ background: "rgba(255,255,255,0.04)", color: "#6B675F" }}
                                    >
                                        Inactive
                                    </span>
                                )}
                            </p>
                            <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "#6B675F" }}>
                                {coupon.discount_type === "percentage"
                                    ? `${coupon.discount_value}% off`
                                    : `₹${coupon.discount_value} off`}
                            </p>
                        </div>

                        {/* Usage */}
                        <div
                            className="flex items-center gap-1.5 text-[12px] sm:text-[13px] shrink-0"
                            style={{ color: "#6B675F" }}
                        >
                            <Hash size={12} />
                            {coupon.current_uses} / {coupon.max_uses ?? "∞"} uses
                        </div>

                        {/* Deactivate */}
                        {coupon.is_active && (
                            <button
                                onClick={() => deactivate(coupon.id)}
                                disabled={deactivatingId === coupon.id}
                                style={{
                                    ...outlineBtnStyle,
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    color: "#B46A5F",
                                    borderColor: "rgba(180,106,95,0.2)",
                                    opacity: deactivatingId === coupon.id ? 0.5 : 1,
                                }}
                            >
                                {deactivatingId === coupon.id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Ban size={12} />
                                )}
                                <span className="hidden sm:inline">Deactivate</span>
                            </button>
                        )}
                    </div>
                ))}
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
        <div className="space-y-3">
            <input
                placeholder="Coupon Code — e.g. FESTIVE10"
                value={form.code}
                onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                }
                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em" }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                    value={form.discount_type}
                    onChange={(e) =>
                        setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })
                    }
                    style={inputStyle}
                >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <input
                    type="number"
                    placeholder={form.discount_type === "percentage" ? "Discount %" : "Discount ₹"}
                    value={form.discount_value || ""}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Max Uses (empty = ∞)"
                    value={form.max_uses || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            max_uses: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                    style={inputStyle}
                />
            </div>

            <button
                onClick={() => onCreate(form)}
                disabled={!form.code || !form.discount_value}
                style={{
                    ...goldBtnStyle,
                    opacity: !form.code || !form.discount_value ? 0.5 : 1,
                }}
            >
                <Save size={14} />
                Create coupon
            </button>
        </div>
    );
}
