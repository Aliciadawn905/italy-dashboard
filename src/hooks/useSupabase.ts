"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

function getLocal<T>(key: string, fallback: T[]): T[] {
  if (!isBrowser) return fallback;
  try {
    const stored = localStorage.getItem(`italy_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T[]) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`italy_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useSupabaseTable<T extends { id: string }>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const fetchData = useCallback(async () => {
    if (!mounted.current) return;

    const supabase = await getSupabase();
    if (!supabase) {
      setData(getLocal<T>(tableName, []));
      setLoading(false);
      return;
    }

    const { data: rows, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && rows) {
      setData(rows as T[]);
    }
    setLoading(false);
  }, [tableName]);

  useEffect(() => {
    mounted.current = true;
    fetchData();

    let cleanup: (() => void) | undefined;

    if (isSupabaseConfigured() && isBrowser) {
      getSupabase().then((supabase) => {
        if (!supabase || !mounted.current) return;

        const channel = supabase
          .channel(`${tableName}_changes`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: tableName },
            () => { fetchData(); }
          )
          .subscribe();

        cleanup = () => { supabase.removeChannel(channel); };
      });
    }

    return () => {
      mounted.current = false;
      cleanup?.();
    };
  }, [tableName, fetchData]);

  const insert = useCallback(
    async (item: Omit<T, "id" | "created_at">) => {
      const supabase = await getSupabase();
      if (!supabase) {
        const newItem = { ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() } as unknown as T;
        const updated = [...data, newItem];
        setData(updated);
        setLocal(tableName, updated);
        return;
      }
      await supabase.from(tableName).insert(item);
      await fetchData();
    },
    [data, tableName, fetchData]
  );

  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      const supabase = await getSupabase();
      if (!supabase) {
        const updated = data.map((item) => item.id === id ? { ...item, ...updates } : item);
        setData(updated);
        setLocal(tableName, updated);
        return;
      }
      await supabase.from(tableName).update(updates).eq("id", id);
      await fetchData();
    },
    [data, tableName, fetchData]
  );

  const remove = useCallback(
    async (id: string) => {
      const supabase = await getSupabase();
      if (!supabase) {
        const updated = data.filter((item) => item.id !== id);
        setData(updated);
        setLocal(tableName, updated);
        return;
      }
      await supabase.from(tableName).delete().eq("id", id);
      await fetchData();
    },
    [data, tableName, fetchData]
  );

  return { data, loading, insert, update, remove, refetch: fetchData };
}
