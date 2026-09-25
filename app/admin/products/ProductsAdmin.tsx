"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/lib/supabase/storage";
import {
    Plus,
    X,
    Save,
    Trash2,
    Edit3,
    ImageIcon,
    Search,
    Package,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Sparkles,
} from "lucide-react";
import type { Product as CatalogProduct } from "@/lib/products";

type Product = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    weight_grams: number;
    image_url: string | null;
    stock: number;
    is_active: boolean;
};

const emptyForm = {
    slug: "",
    name: "",
    description: "",
    price: 0,
    weightGrams: 200,
    imageUrl: "",
    stock: 0,
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
    transition: "opacity 200ms ease, transform 100ms ease",
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

export function ProductsAdmin({
    initialProducts,
    catalogProducts,
}: {
    initialProducts: Product[];
    catalogProducts: CatalogProduct[];
}) {
    const [products, setProducts] = useState(initialProducts);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCatalog, setShowCatalog] = useState(true);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCatalog = catalogProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function handleImagePick(
        e: React.ChangeEvent<HTMLInputElement>,
        onUploaded: (url: string) => void
    ) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadProductImage(file);
            onUploaded(url);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function saveEdit(id: string, updates: Partial<Product>) {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                name: updates.name,
                description: updates.description,
                price: updates.price,
                weightGrams: updates.weight_grams,
                imageUrl: updates.image_url,
                stock: updates.stock,
                isActive: updates.is_active,
            }),
        });
        const data = await res.json();
        if (data.product) {
            setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
            setEditingId(null);
        } else {
            alert(data.error ?? "Update failed");
        }
    }

    async function deactivate(id: string) {
        if (!confirm("Remove this product from the storefront?")) return;
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: false } : p)));
        }
    }

    async function createProduct(form: typeof emptyForm) {
        const res = await fetch("/api/admin/products", {
            method: "POST",
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.product) {
            setProducts((prev) => [data.product, ...prev]);
            setShowNewForm(false);
        } else {
            alert(data.error ?? "Create failed");
        }
    }

    return (
        <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search
                        size={16}
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6B675F",
                        }}
                    />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        style={{
                            ...inputStyle,
                            paddingLeft: "36px",
                        }}
                    />
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
                            <Plus size={14} /> Add Product
                        </>
                    )}
                </button>
            </div>

            {/* New Product Form */}
            {showNewForm && (
                <div style={{ ...cardStyle, padding: "20px", marginBottom: "24px" }}>
                    <h3
                        className="text-[15px] font-medium mb-4 flex items-center gap-2"
                        style={{ color: "#F2EFE9", fontFamily: "var(--font-display)" }}
                    >
                        <Plus size={16} style={{ color: "#C6A15B" }} />
                        New Product
                    </h3>
                    <NewProductForm
                        onCreate={createProduct}
                        onImagePick={handleImagePick}
                        uploading={uploading}
                    />
                </div>
            )}

            {/* Catalog Products Section */}
            <div className="mb-6">
                <button
                    onClick={() => setShowCatalog((v) => !v)}
                    className="flex items-center gap-2 mb-4 w-full"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                    <Sparkles size={16} style={{ color: "#C6A15B" }} />
                    <h2
                        className="text-[14px] sm:text-[15px] font-medium flex-1 text-left"
                        style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                    >
                        Catalog Fragrances
                    </h2>
                    <span className="text-[12px] mr-2" style={{ color: "#6B675F" }}>
                        {filteredCatalog.length} items
                    </span>
                    {showCatalog ? (
                        <ChevronUp size={16} style={{ color: "#6B675F" }} />
                    ) : (
                        <ChevronDown size={16} style={{ color: "#6B675F" }} />
                    )}
                </button>

                {showCatalog && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {filteredCatalog.map((product) => (
                            <CatalogProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Database Products */}
            {filteredProducts.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Package size={16} style={{ color: "#C6A15B" }} />
                        <h2
                            className="text-[14px] sm:text-[15px] font-medium"
                            style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                        >
                            Store Products
                        </h2>
                        <span className="text-[12px] ml-auto" style={{ color: "#6B675F" }}>
                            {filteredProducts.length} items
                        </span>
                    </div>
                    <div style={cardStyle} className="overflow-hidden">
                        {filteredProducts.map((product, idx) =>
                            editingId === product.id ? (
                                <div
                                    key={product.id}
                                    className="p-4 sm:p-5"
                                    style={{
                                        borderBottom:
                                            idx < filteredProducts.length - 1
                                                ? "1px solid rgba(255,255,255,0.04)"
                                                : "none",
                                    }}
                                >
                                    <EditProductForm
                                        product={product}
                                        onSave={(updates) => saveEdit(product.id, updates)}
                                        onCancel={() => setEditingId(null)}
                                        onImagePick={handleImagePick}
                                        uploading={uploading}
                                    />
                                </div>
                            ) : (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 transition-colors"
                                    style={{
                                        borderBottom:
                                            idx < filteredProducts.length - 1
                                                ? "1px solid rgba(255,255,255,0.04)"
                                                : "none",
                                        opacity: product.is_active ? 1 : 0.4,
                                    }}
                                >
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded-md shrink-0"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-md flex items-center justify-center shrink-0"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                background: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <ImageIcon size={18} style={{ color: "#6B675F" }} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] sm:text-[14px] font-medium truncate" style={{ color: "#F2EFE9" }}>
                                            {product.name}
                                            {!product.is_active && (
                                                <span className="text-[11px] font-normal ml-2" style={{ color: "#6B675F" }}>
                                                    — inactive
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[12px] sm:text-[13px] truncate" style={{ color: "#6B675F" }}>
                                            {product.description}
                                        </p>
                                    </div>
                                    {/* Price & stock - hidden on very small screens */}
                                    <span
                                        className="hidden sm:block text-[14px] sm:text-[15px] font-bold whitespace-nowrap"
                                        style={{ fontFamily: "var(--font-display)", color: "#C6A15B" }}
                                    >
                                        ₹{product.price}
                                    </span>
                                    <span className="hidden sm:block text-[12px] sm:text-[13px] w-20 text-right" style={{ color: "#6B675F" }}>
                                        {product.stock} in stock
                                    </span>
                                    <div className="flex gap-1.5 shrink-0">
                                        <button
                                            onClick={() => setEditingId(product.id)}
                                            style={{
                                                ...outlineBtnStyle,
                                                padding: "6px 10px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            <Edit3 size={12} />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        {product.is_active && (
                                            <button
                                                onClick={() => deactivate(product.id)}
                                                style={{
                                                    ...outlineBtnStyle,
                                                    padding: "6px 10px",
                                                    fontSize: "12px",
                                                    color: "#B46A5F",
                                                    borderColor: "rgba(180,106,95,0.2)",
                                                }}
                                            >
                                                <Trash2 size={12} />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ----------------------------------------------------------------
   Catalog Product Card
   ---------------------------------------------------------------- */

function CatalogProductCard({ product }: { product: CatalogProduct }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="relative overflow-hidden rounded-lg"
            style={cardStyle}
        >
            {/* Product Image */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    height: "200px",
                    background: "#171717",
                }}
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    style={{ padding: "12px" }}
                />
                {/* Active badge */}
                <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{
                        background: "rgba(110,143,107,0.15)",
                        color: "#6E8F6B",
                        fontSize: "10px",
                    }}
                >
                    <Eye size={10} />
                    Active
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                    <h3
                        className="text-[15px] font-medium"
                        style={{ color: "#F2EFE9", fontFamily: "var(--font-display)" }}
                    >
                        {product.name}
                    </h3>
                    <span
                        className="text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2"
                        style={{
                            background: "rgba(198,161,91,0.12)",
                            color: "#C6A15B",
                        }}
                    >
                        {product.type}
                    </span>
                </div>
                {product.tagline && (
                    <p className="text-[12px] italic mb-2" style={{ color: "#9A958C" }}>
                        {product.tagline}
                    </p>
                )}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#6B675F" }}>
                        {product.size}
                    </span>
                    {product.family && (
                        <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#6B675F" }}>
                            {product.family}
                        </span>
                    )}
                </div>

                {/* Notes */}
                <div className="space-y-1 mb-3">
                    <NoteRow label="Top" value={product.notes.top} />
                    <NoteRow label="Heart" value={product.notes.heart} />
                    <NoteRow label="Base" value={product.notes.base} />
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="text-[11px] flex items-center gap-1 w-full justify-center py-1.5 rounded"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        color: "#9A958C",
                        border: "none",
                        cursor: "pointer",
                        transition: "color 200ms",
                    }}
                >
                    {expanded ? "Show less" : "Show details"}
                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expanded && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#9A958C" }}>
                            {product.description.slice(0, 200)}...
                        </p>
                        {product.gender && (
                            <div className="mb-2">
                                <span className="text-[10px] tracking-wider uppercase" style={{ color: "#6B675F" }}>
                                    Gender
                                </span>
                                <p className="text-[12px]" style={{ color: "#9A958C" }}>
                                    {product.gender.split("\n")[0]}
                                </p>
                            </div>
                        )}
                        {product.suitableFor && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {product.suitableFor.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] px-1.5 py-0.5 rounded"
                                        style={{
                                            background: "rgba(198,161,91,0.08)",
                                            color: "#C6A15B",
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function NoteRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-2">
            <span
                className="text-[10px] tracking-wider uppercase w-10 shrink-0 pt-px"
                style={{ color: "#C6A15B" }}
            >
                {label}
            </span>
            <span className="text-[11px]" style={{ color: "#9A958C" }}>
                {value}
            </span>
        </div>
    );
}

/* ----------------------------------------------------------------
   New Product Form
   ---------------------------------------------------------------- */

function NewProductForm({
    onCreate,
    onImagePick,
    uploading,
}: {
    onCreate: (form: typeof emptyForm) => void;
    onImagePick: (e: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) => void;
    uploading: boolean;
}) {
    const [form, setForm] = useState(emptyForm);

    return (
        <div className="space-y-3">
            <input
                placeholder="Name — e.g. Veloura Noir"
                value={form.name}
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                }
                style={inputStyle}
            />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                rows={3}
            />
            <div className="grid grid-cols-3 gap-3">
                <input
                    type="number"
                    placeholder="Price (₹)"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock || ""}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Weight (g)"
                    value={form.weightGrams || ""}
                    onChange={(e) => setForm({ ...form, weightGrams: Number(e.target.value) })}
                    style={inputStyle}
                />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <label
                    style={{
                        ...outlineBtnStyle,
                        cursor: "pointer",
                    }}
                >
                    <ImageIcon size={14} />
                    Choose Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImagePick(e, (url) => setForm({ ...form, imageUrl: url }))}
                        style={{ display: "none" }}
                    />
                </label>
                {form.imageUrl && (
                    <Image src={form.imageUrl} alt="preview" width={48} height={48} className="rounded-md" style={{ border: "1px solid rgba(255,255,255,0.06)" }} />
                )}
            </div>
            <button
                onClick={() => onCreate(form)}
                disabled={uploading || !form.name || !form.price}
                style={{
                    ...goldBtnStyle,
                    opacity: uploading || !form.name || !form.price ? 0.5 : 1,
                }}
            >
                <Save size={14} />
                {uploading ? "Uploading image…" : "Create product"}
            </button>
        </div>
    );
}

/* ----------------------------------------------------------------
   Edit Product Form
   ---------------------------------------------------------------- */

function EditProductForm({
    product,
    onSave,
    onCancel,
    onImagePick,
    uploading,
}: {
    product: Product;
    onSave: (updates: Partial<Product>) => void;
    onCancel: () => void;
    onImagePick: (e: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) => void;
    uploading: boolean;
}) {
    const [form, setForm] = useState(product);

    return (
        <div className="space-y-3">
            <h3
                className="text-[14px] font-medium flex items-center gap-2 mb-2"
                style={{ color: "#C6A15B", fontFamily: "var(--font-display)" }}
            >
                <Edit3 size={14} />
                Editing — {product.name}
            </h3>
            <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
            />
            <textarea
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                rows={3}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    style={inputStyle}
                    placeholder="Price"
                />
                <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    style={inputStyle}
                    placeholder="Stock"
                />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <label
                    style={{
                        ...outlineBtnStyle,
                        cursor: "pointer",
                    }}
                >
                    <ImageIcon size={14} />
                    Change Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImagePick(e, (url) => setForm({ ...form, image_url: url }))}
                        style={{ display: "none" }}
                    />
                </label>
                {form.image_url && (
                    <Image src={form.image_url} alt="preview" width={48} height={48} className="rounded-md" style={{ border: "1px solid rgba(255,255,255,0.06)" }} />
                )}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onSave(form)}
                    disabled={uploading}
                    style={{
                        ...goldBtnStyle,
                        opacity: uploading ? 0.5 : 1,
                    }}
                >
                    <Save size={14} />
                    {uploading ? "Uploading image…" : "Save changes"}
                </button>
                <button onClick={onCancel} style={outlineBtnStyle}>
                    <X size={14} />
                    Cancel
                </button>
            </div>
        </div>
    );
}