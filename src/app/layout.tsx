import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: {
    default: "מפת הייטק | Hi-Tech Map",
    template: "%s | מפת הייטק",
  },
  description: "מפת ידע מקיפה לעולם ההייטק — ML, אלגוריתמיקה, רשתות, מערכות, אבטחה ונתונים",
  metadataBase: new URL("https://orinlevi.github.io/hi_tech_map"),
  openGraph: {
    title: "מפת הייטק | Hi-Tech Map",
    description: "מפת ידע מקיפה לעולם ההייטק",
    url: "https://orinlevi.github.io/hi_tech_map",
    siteName: "מפת הייטק",
    locale: "he_IL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}})()` }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${heebo.variable} font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          דלג לתוכן
        </a>
        <Navbar />
        <div className="flex-1" id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
