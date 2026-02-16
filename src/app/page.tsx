import Link from "next/link";
import { getSections } from "@/lib/content";

const accentColors: Record<string, { border: string; bg: string; hover: string; text: string }> = {
  teal:    { border: "border-teal-200 dark:border-teal-900",    bg: "bg-teal-50/50 dark:bg-teal-950/30",    hover: "hover:border-teal-400 dark:hover:border-teal-700",    text: "text-teal-600 dark:text-teal-400" },
  cyan:    { border: "border-cyan-200 dark:border-cyan-900",    bg: "bg-cyan-50/50 dark:bg-cyan-950/30",    hover: "hover:border-cyan-400 dark:hover:border-cyan-700",    text: "text-cyan-600 dark:text-cyan-400" },
  emerald: { border: "border-emerald-200 dark:border-emerald-900", bg: "bg-emerald-50/50 dark:bg-emerald-950/30", hover: "hover:border-emerald-400 dark:hover:border-emerald-700", text: "text-emerald-600 dark:text-emerald-400" },
  blue:    { border: "border-blue-200 dark:border-blue-900",    bg: "bg-blue-50/50 dark:bg-blue-950/30",    hover: "hover:border-blue-400 dark:hover:border-blue-700",    text: "text-blue-600 dark:text-blue-400" },
  purple:  { border: "border-purple-200 dark:border-purple-900",  bg: "bg-purple-50/50 dark:bg-purple-950/30",  hover: "hover:border-purple-400 dark:hover:border-purple-700",  text: "text-purple-600 dark:text-purple-400" },
  amber:   { border: "border-amber-200 dark:border-amber-900",   bg: "bg-amber-50/50 dark:bg-amber-950/30",   hover: "hover:border-amber-400 dark:hover:border-amber-700",   text: "text-amber-600 dark:text-amber-400" },
  rose:    { border: "border-rose-200 dark:border-rose-900",    bg: "bg-rose-50/50 dark:bg-rose-950/30",    hover: "hover:border-rose-400 dark:hover:border-rose-700",    text: "text-rose-600 dark:text-rose-400" },
};

const defaultAccent = accentColors.teal;

export default function HomePage() {
  const sections = getSections();
  const totalUnits = sections.reduce((sum, s) => sum + s.units.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🗺️ מפת הייטק
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          מפת ידע מקיפה לעולם ההייטק — מ-AI ו-Machine Learning, דרך רשתות ומערכות, ועד אבטחת מידע ומסדי נתונים.
        </p>
        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500 dark:text-gray-400">
          <span><strong className="text-teal-600 dark:text-teal-400">{sections.length}</strong> מדורים</span>
          <span><strong className="text-teal-600 dark:text-teal-400">{totalUnits}</strong> נושאים</span>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const accent = accentColors[section.color] || defaultAccent;
          return (
            <div
              key={section.id}
              className={`rounded-xl border ${accent.border} ${accent.bg} p-5 transition-all duration-200 ${accent.hover} hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{section.emoji}</span>
                <h2 className={`font-bold ${accent.text}`}>{section.title}</h2>
              </div>
              <ul className="space-y-1.5">
                {section.units.map((unit) => (
                  <li key={unit.slug}>
                    <Link
                      href={`/${unit.slug}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {unit.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
                {section.units.length} נושאים
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
