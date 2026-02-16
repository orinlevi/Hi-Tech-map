import { notFound } from "next/navigation";
import Link from "next/link";
import { getSections, getUnitBySlug, getUnitContent, getAdjacentUnits } from "@/lib/content";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { TableOfContents } from "@/components/content/TableOfContents";

export function generateStaticParams() {
  const sections = getSections();
  const params: { unitSlug: string }[] = [];
  for (const section of sections) {
    for (const unit of section.units) {
      params.push({ unitSlug: unit.slug });
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: Promise<{ unitSlug: string }> }) {
  return params.then(({ unitSlug }) => {
    const result = getUnitBySlug(unitSlug);
    if (!result) return { title: "לא נמצא" };
    return {
      title: result.unit.title,
      description: `${result.unit.title} — ${result.section.title} | מפת הייטק`,
    };
  });
}

export default async function UnitPage({ params }: { params: Promise<{ unitSlug: string }> }) {
  const { unitSlug } = await params;
  const result = getUnitBySlug(unitSlug);
  if (!result) notFound();

  const { section, unit } = result;
  const content = getUnitContent(unit);
  const { prev, next } = getAdjacentUnits(unitSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/hi_tech_map" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          מפת הייטק
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-400 dark:text-gray-500">{section.emoji} {section.title}</span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-700 dark:text-gray-200">{unit.title}</span>
      </nav>

      <div className="flex gap-8">
        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-4xl">
          <MarkdownRenderer content={content} />

          {/* Prev/Next navigation */}
          <nav className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            {prev ? (
              <Link
                href={`/hi_tech_map/${prev.slug}`}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                → {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                href={`/hi_tech_map/${next.slug}`}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                {next.title} ←
              </Link>
            ) : <span />}
          </nav>
        </main>

        {/* Table of Contents */}
        <aside className="w-56 shrink-0">
          <TableOfContents markdown={content} />
        </aside>
      </div>
    </div>
  );
}
