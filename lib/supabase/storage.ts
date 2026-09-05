import { createClient } from "@/lib/supabase/client";

// Uploads a File to the "product-images" bucket and returns its public URL.
// Call this from the browser (client component) before saving the product.
export async function uploadProductImage(file: File): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: false });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
}