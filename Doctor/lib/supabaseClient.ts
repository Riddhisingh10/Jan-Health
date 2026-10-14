import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const DEFAULT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean } {
  let url = DEFAULT_URL;
  let key = DEFAULT_KEY;

  if (typeof window !== "undefined") {
    const localUrl = localStorage.getItem("janhealth_supabase_url");
    const localKey = localStorage.getItem("janhealth_supabase_key");
    if (localUrl && localKey) {
      url = localUrl;
      key = localKey;
    }
  }

  const isConfigured = Boolean(
    url &&
      key &&
      !url.includes("your-project-id") &&
      !key.includes("your-anon-key") &&
      url.startsWith("https://")
  );

  return { url, key, isConfigured };
}

export function saveSupabaseCredentials(url: string, key: string): boolean {
  if (typeof window === "undefined") return false;
  localStorage.setItem("janhealth_supabase_url", url.trim());
  localStorage.setItem("janhealth_supabase_key", key.trim());
  cachedClient = null; // Invalidate cache so new client is instantiated
  return true;
}

export function clearSupabaseCredentials(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("janhealth_supabase_url");
  localStorage.removeItem("janhealth_supabase_key");
  cachedClient = null;
}

export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { isConfigured } = getSupabaseCredentials();
  return isConfigured;
}
