import { createClient } from "@supabase/supabase-js";

const BUCKET = "Product-images";
const MAX_ATTEMPTS = 3;

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase Storage is not configured (missing NEXT_PUBLIC_SUPABASE_URL or a Supabase key).");
  }
  return { supabase: createClient(url, key), host: (() => {
    try { return new URL(url).host; } catch { return "invalid-url"; }
  })() };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadImageBuffer(buffer: Buffer, contentType: string, extension: string): Promise<string> {
  const { supabase, host } = getClient();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  let lastError: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
      contentType,
      cacheControl: "31536000", // 1 year — filenames are unique per upload, safe to cache forever
      upsert: false,
    });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      return data.publicUrl;
    }

    lastError = error.message;
    // "fetch failed" / network-level errors are usually transient — worth a couple
    // of retries before giving up. A real config or permissions error won't be
    // fixed by retrying, but retrying costs little in that case either.
    console.error(`Supabase Storage upload attempt ${attempt}/${MAX_ATTEMPTS} failed (host: ${host}): ${error.message}`);
    if (attempt < MAX_ATTEMPTS) await sleep(attempt * 500);
  }

  throw new Error(`Supabase Storage upload failed after ${MAX_ATTEMPTS} attempts (host: ${host}): ${lastError}`);
}
