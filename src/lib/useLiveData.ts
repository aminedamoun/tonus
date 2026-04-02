'use client';

import { useState, useEffect } from 'react';

/**
 * Fetches live data from GitHub via our API route.
 * Falls back to the static import if the fetch fails.
 * This ensures the site always shows the latest data after admin saves.
 */
export function useLiveData<T>(filename: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/data/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((live) => {
        if (!cancelled) setData(live as T);
      })
      .catch(() => {
        // Keep using fallback (static import) if API fails
      });

    return () => {
      cancelled = true;
    };
  }, [filename]);

  return data;
}
