import Fuse, { type FuseResult } from "fuse.js";

export interface SearchEntry {
  sectionId: string;
  sectionTitle: string;
  sectionEmoji: string;
  unitSlug: string;
  unitTitle: string;
  text: string;
}

let _fuseInstance: Fuse<SearchEntry> | null = null;
let _rawData: SearchEntry[] | null = null;
let _loadingPromise: Promise<void> | null = null;

// We need the basePath for fetching the index
const BASE_PATH = "/Hi-Tech-map";

/** Lazy-load the full search index and cache it. */
async function ensureLoaded(): Promise<void> {
  if (_rawData) return;

  if (!_loadingPromise) {
    _loadingPromise = fetch(`${BASE_PATH}/search-index.json`)
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        _rawData = data;
      });
  }

  await _loadingPromise;
}

/** Get the global Fuse instance (searches all sections). */
export async function getGlobalFuse(): Promise<Fuse<SearchEntry>> {
  await ensureLoaded();

  if (!_fuseInstance) {
    _fuseInstance = new Fuse(_rawData!, {
      keys: [
        { name: "unitTitle", weight: 2 },
        { name: "text", weight: 1 },
        { name: "sectionTitle", weight: 0.5 },
      ],
      threshold: 0.35,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }

  return _fuseInstance;
}

// Cache per-section Fuse instances
const _sectionFuseCache = new Map<string, Fuse<SearchEntry>>();

/** Get a Fuse instance scoped to a specific section. */
export async function getSectionFuse(
  sectionId: string
): Promise<Fuse<SearchEntry>> {
  await ensureLoaded();

  if (!_sectionFuseCache.has(sectionId)) {
    const sectionData = _rawData!.filter((e) => e.sectionId === sectionId);
    const fuse = new Fuse(sectionData, {
      keys: [
        { name: "unitTitle", weight: 2 },
        { name: "text", weight: 1 },
      ],
      threshold: 0.35,
      includeMatches: true,
      minMatchCharLength: 2,
    });
    _sectionFuseCache.set(sectionId, fuse);
  }

  return _sectionFuseCache.get(sectionId)!;
}

/** Extract a ~60 char snippet from text around the query match. */
export function getSnippet(text: string, query: string): string | null {
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return text.slice(0, 60);
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + query.length + 40);
  return text.slice(start, end);
}
