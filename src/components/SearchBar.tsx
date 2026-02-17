"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FuseResult } from "fuse.js";
import { type SearchEntry, getGlobalFuse, getSnippet } from "@/lib/search";

interface ResultItem {
  id: string;
  href: string;
  label: string;
  sublabel?: string;
  emoji?: string;
  snippet?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [contentResults, setContentResults] = useState<
    FuseResult<SearchEntry>[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Build flat list of all result items for keyboard nav
  const allItems: ResultItem[] = contentResults.map((r) => ({
    id: `content-${r.item.sectionId}-${r.item.unitSlug}`,
    href: `/${r.item.unitSlug}`,
    label: r.item.unitTitle,
    sublabel: `${r.item.sectionEmoji} ${r.item.sectionTitle}`,
    snippet: getSnippet(r.item.text, query) || undefined,
  }));

  const searchContent = useCallback(async (q: string) => {
    if (q.length < 2) {
      setContentResults([]);
      return;
    }
    try {
      const fuse = await getGlobalFuse();
      const results = fuse.search(q, { limit: 8 });
      setContentResults(results);
    } catch {
      setContentResults([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContent(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, searchContent]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [contentResults.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function navigate(item: ResultItem) {
    router.push(item.href);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || allItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < allItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : allItems.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(allItems[activeIndex]);
    }
  }

  const hasResults = allItems.length > 0;

  return (
    <div
      ref={ref}
      className="relative w-full max-w-sm"
      role="combobox"
      aria-expanded={open && hasResults}
      aria-haspopup="listbox"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="חיפוש נושא..."
          aria-label="חיפוש נושאים"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? allItems[activeIndex]?.id : undefined
          }
          className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700/60 rounded-lg px-3 py-1.5 pr-8 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/20 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm shadow-sm"
          dir="rtl"
        />
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <kbd className="hidden sm:inline-block absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
          ⌘K
        </kbd>
      </div>

      {open && hasResults && (
        <ul
          role="listbox"
          aria-label="תוצאות חיפוש"
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          <li role="presentation">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 px-4 pt-2 pb-1 uppercase tracking-wide">
              תוצאות
            </p>
            <ul role="group">
              {contentResults.map((result) => {
                const entry = result.item;
                const itemId = `content-${entry.sectionId}-${entry.unitSlug}`;
                const idx = allItems.findIndex((i) => i.id === itemId);
                const snippet = getSnippet(entry.text, query);
                return (
                  <li
                    key={itemId}
                    id={itemId}
                    role="option"
                    aria-selected={activeIndex === idx}
                  >
                    <button
                      onClick={() => navigate(allItems[idx])}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full text-right px-4 py-2.5 transition-colors ${
                        activeIndex === idx
                          ? "bg-teal-50 dark:bg-teal-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <p className="text-gray-800 dark:text-gray-200 text-sm">
                        {entry.unitTitle}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-[11px]">
                        {entry.sectionEmoji} {entry.sectionTitle}
                      </p>
                      {snippet && (
                        <p className="text-gray-400 dark:text-gray-600 text-[10px] mt-0.5 line-clamp-1 direction-rtl">
                          ...{snippet}...
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      )}

      {open && query.length > 0 && !hasResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl px-4 py-4 text-center">
          <p className="text-gray-500 text-sm">
            לא נמצאו תוצאות 🤷🏻‍♀️
          </p>
        </div>
      )}
    </div>
  );
}
