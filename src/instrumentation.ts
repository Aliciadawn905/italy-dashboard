// Polyfill localStorage for Node.js 22+ which has a broken global localStorage
// that lacks standard getItem/setItem methods (needed by @supabase/supabase-js)
export async function register() {
  if (typeof window === "undefined") {
    const storage = new Map<string, string>();
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() { return storage.size; },
      key: (index: number) => [...storage.keys()][index] ?? null,
    };
  }
}
