import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "12w Planner",
  description: "My 3-month plan: job applications, building, French and weekly reviews.",
};

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/week", label: "Week" },
  { href: "/plan", label: "3 months" },
  { href: "/later", label: "Rules & Later" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
          <header>
            <div className="eyebrow">Product developer · backend + design</div>
            <h1 className="text-2xl font-bold">12w Planner</h1>
          </header>
          <nav aria-label="Sections" className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-[var(--bg)] py-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full px-4 py-2 font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
                {n.label}
              </Link>
            ))}
          </nav>
          <main className="flex flex-col gap-5">{children}</main>
        </div>
      </body>
    </html>
  );
}
