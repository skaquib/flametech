import { createClient } from "@supabase/supabase-js";

const BUCKET = "Product-images";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase Storage is not configured (missing NEXT_PUBLIC_SUPABASE_URL or a Supabase key).");
  }
  return createClient(url, key);
}

export async function uploadImageBuffer(buffer: Buffer, contentType: string, extension: string): Promise<string> {
  const supabase = getClient();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType,
    cacheControl: "31536000", // 1 year — filenames are unique per upload, safe to cache forever
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}
