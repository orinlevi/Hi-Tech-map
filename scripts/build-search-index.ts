/**
 * Build a static search index from all markdown content.
 * Run: npx tsx scripts/build-search-index.ts
 * Output: public/search-index.json
 */

import fs from "fs";
import path from "path";

interface RawUnit {
  slug: string;
  file: string;
  title: string;
}

interface RawSection {
  id: string;
  title: string;
  emoji: string;
  color: string;
  units: RawUnit[];
}

interface SearchEntry {
  sectionId: string;
  sectionTitle: string;
  sectionEmoji: string;
  unitSlug: string;
  unitTitle: string;
  text: string; // plain text snippet for searching
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");

/** Strip markdown/latex/html to get searchable plain text */
function stripToPlainText(markdown: string): string {
  let text = markdown;

  // Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\n?/, "");

  // Remove display math blocks
  text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");

  // Remove inline math
  text = text.replace(/\$[^$\n]+?\$/g, " ");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Remove admonition markers (MkDocs style)
  text = text.replace(/^!!!?\s+\w+.*$/gm, "");
  text = text.replace(/^\?\?\?\+?\s+\w+.*$/gm, "");

  // Remove markdown images
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  // Remove markdown links, keep text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Remove markdown formatting
  text = text.replace(/#{1,6}\s+/g, ""); // headings
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1"); // bold/italic
  text = text.replace(/`{1,3}[^`]*`{1,3}/g, " "); // inline code
  text = text.replace(/```[\s\S]*?```/g, " "); // code blocks

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, "");

  // Remove table formatting
  text = text.replace(/\|/g, " ");
  text = text.replace(/^[-:]+$/gm, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

function main() {
  const sectionsPath = path.join(CONTENT_DIR, "sections.json");
  const sectionsData = JSON.parse(fs.readFileSync(sectionsPath, "utf-8"));
  const sections: RawSection[] = sectionsData.sections;

  const index: SearchEntry[] = [];
  let totalFiles = 0;

  for (const section of sections) {
    for (const unit of section.units) {
      const filePath = path.join(CONTENT_DIR, unit.file);

      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠ Missing: ${unit.file}`);
        continue;
      }

      const raw = fs.readFileSync(filePath, "utf-8");
      const plainText = stripToPlainText(raw);

      // Take first 600 chars for the index — enough for search matching
      const snippet = plainText.slice(0, 600);

      index.push({
        sectionId: section.id,
        sectionTitle: section.title,
        sectionEmoji: section.emoji,
        unitSlug: unit.slug,
        unitTitle: unit.title,
        text: snippet,
      });

      totalFiles++;
    }
  }

  // Ensure output dir exists
  const outDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index));

  const sizeKB = Math.round(fs.statSync(OUTPUT_PATH).size / 1024);
  console.log(
    `Search index built: ${totalFiles} units, ${sizeKB} KB → ${OUTPUT_PATH}`
  );
}

main();
