import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-xl">🗺️</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
            מפת הייטק
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
