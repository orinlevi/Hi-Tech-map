import fs from "fs";
import path from "path";
import sectionsData from "../../content/sections.json";

export interface Unit {
  slug: string;
  file: string;
  title: string;
}

export interface Section {
  id: string;
  title: string;
  emoji: string;
  color: string;
  units: Unit[];
}

export function getSections(): Section[] {
  return sectionsData.sections;
}

export function getSectionById(id: string): Section | undefined {
  return sectionsData.sections.find((s) => s.id === id);
}

export function getUnitBySlug(slug: string): { section: Section; unit: Unit } | undefined {
  for (const section of sectionsData.sections) {
    const unit = section.units.find((u) => u.slug === slug);
    if (unit) return { section, unit };
  }
  return undefined;
}

export function getUnitContent(unit: Unit): string {
  const filePath = path.join(process.cwd(), "content", unit.file);
  return fs.readFileSync(filePath, "utf-8");
}

export function getAdjacentUnits(slug: string): { prev: Unit | null; next: Unit | null } {
  const allUnits: Unit[] = [];
  for (const section of sectionsData.sections) {
    allUnits.push(...section.units);
  }
  const idx = allUnits.findIndex((u) => u.slug === slug);
  return {
    prev: idx > 0 ? allUnits[idx - 1] : null,
    next: idx < allUnits.length - 1 ? allUnits[idx + 1] : null,
  };
}

/**
 * Build a map from .md filename -> slug for link rewriting.
 */
export function buildFileToSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const section of sectionsData.sections) {
    for (const unit of section.units) {
      map.set(unit.file, unit.slug);
      const basename = unit.file.split("/").pop();
      if (basename) {
        map.set(basename, unit.slug);
      }
    }
  }
  return map;
}
