"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/lib/supabase/storage";

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

const inputClass =
    "w-full border border-[#E4E4E1] rounded-[4px] px-3 py-2 text-[14px] placeholder:text-[#9C9C95] focus:outline-none focus:border-[#2F3A8F]";

export function ProductsAdmin({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [uploading, setUploading] = useState(false);

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
            <button
                onClick={() => setShowNewForm((v) => !v)}
                className="mb-8 text-[13px] px-4 py-2 rounded-[4px] bg-[#2F3A8F] text-white hover:bg-[#262F73] transition-colors"
            >
                {showNewForm ? "Cancel" : "Add new product"}
            </button>

            {showNewForm && (
                <NewProductForm
                    onCreate={createProduct}
                    onImagePick={handleImagePick}
                    uploading={uploading}
                />
            )}

            <div className="border border-[#E4E4E1] rounded-[4px] divide-y divide-[#E4E4E1]">
                {products.map((product) =>
                    editingId === product.id ? (
                        <div key={product.id} className="p-5">
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
                            className={`flex items-center gap-4 px-5 py-4 ${!product.is_active ? "opacity-40" : ""}`}
                        >
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-12 h-12 rounded-[3px] border border-[#E4E4E1]"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-[3px] border border-[#E4E4E1] bg-[#FAFAF9]" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium">
                                    {product.name}
                                    {!product.is_active && (
                                        <span className="text-[12px] text-[#9C9C95] font-normal"> — inactive</span>
                                    )}
                                </p>
                                <p className="text-[13px] text-[#6E6E68] truncate">{product.description}</p>
                            </div>
                            <span
                                className="text-[15px] font-bold whitespace-nowrap"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                ₹{product.price}
                            </span>
                            <span className="text-[13px] text-[#6E6E68] w-20 text-right">
                                {product.stock} in stock
                            </span>
                            <button
                                onClick={() => setEditingId(product.id)}
                                className="text-[13px] px-3 py-1.5 rounded-[4px] border border-[#E4E4E1] hover:bg-[#FAFAF9] transition-colors"
                            >
                                Edit
                            </button>
                            {product.is_active && (
                                <button
                                    onClick={() => deactivate(product.id)}
                                    className="text-[13px] px-3 py-1.5 rounded-[4px] border border-[#E4E4E1] hover:bg-[#FAFAF9] text-[#B3261E] transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

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
        <div className="border border-[#E4E4E1] rounded-[4px] p-5 mb-6 space-y-3">
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
                className={inputClass}
            />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
                rows={3}
            />
            <div className="flex gap-3">
                <input
                    type="number"
                    placeholder="Price (₹)"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock || ""}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
                <input
                    type="number"
                    placeholder="Weight (g)"
                    value={form.weightGrams || ""}
                    onChange={(e) => setForm({ ...form, weightGrams: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
            </div>
            <input type="file" accept="image/*" onChange={(e) => onImagePick(e, (url) => setForm({ ...form, imageUrl: url }))} />
            {form.imageUrl && (
                <Image src={form.imageUrl} alt="preview" width={56} height={56} className="rounded-[3px]" />
            )}
            <button
                onClick={() => onCreate(form)}
                disabled={uploading || !form.name || !form.price}
                className="text-[13px] px-4 py-2 rounded-[4px] bg-[#2F3A8F] text-white disabled:opacity-50"
            >
                {uploading ? "Uploading image…" : "Create product"}
            </button>
        </div>
    );
}

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
            <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
            />
            <textarea
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
                rows={3}
            />
            <div className="flex gap-3">
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
                <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className={`${inputClass} w-32`}
                />
            </div>
            <input type="file" accept="image/*" onChange={(e) => onImagePick(e, (url) => setForm({ ...form, image_url: url }))} />
            {form.image_url && (
                <Image src={form.image_url} alt="preview" width={56} height={56} className="rounded-[3px]" />
            )}
            <div className="flex gap-2">
                <button
                    onClick={() => onSave(form)}
                    disabled={uploading}
                    className="text-[13px] px-4 py-2 rounded-[4px] bg-[#2F3A8F] text-white disabled:opacity-50"
                >
                    {uploading ? "Uploading image…" : "Save"}
                </button>
                <button onClick={onCancel} className="text-[13px] px-4 py-2 rounded-[4px] border border-[#E4E4E1]">
                    Cancel
                </button>
            </div>
        </div>
    );
}