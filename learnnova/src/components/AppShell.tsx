"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { useAppData } from "@/context/AppDataContext";

const NAV_ITEMS = [
  {
    href: "/",
    label: "मुख्य पान",
    description: "दैनंदिन प्रगती",
    icon: "🏠",
  },
  {
    href: "/study",
    label: "अभ्यास व्यवस्थापक",
    description: "वेळ व लक्ष",
    icon: "📚",
  },
  {
    href: "/sleep",
    label: "झोप ट्रॅकर",
    description: "उत्तम विश्रांती",
    icon: "🌙",
  },
  {
    href: "/habits",
    label: "सवयी",
    description: "रोजची सवय",
    icon: "🌟",
  },
  {
    href: "/chat",
    label: "AI संवाद",
    description: "समजूतदार मदत",
    icon: "🤖",
  },
  {
    href: "/settings",
    label: "सेटिंग्ज",
    description: "ध्येय व पसंती",
    icon: "⚙️",
  },
];

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { hydrated } = useAppData();

  const activePath = useMemo(() => {
    if (!pathname) return "/";
    if (pathname === "/") return pathname;
    return pathname.replace(/\/$/, "");
  }, [pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card px-8 py-6 text-center">
          <p className="text-lg font-medium text-[color:var(--accent)]">
            लोड होत आहे...
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            तुमचे जतन केलेले डेटा उघडत आहे.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="pill">Learnnova</span>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              <span className="title-gradient">तुझा स्मार्ट अभ्यास साथी</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
              Learnnova तुमच्या अभ्यास, झोप आणि सवयींचे सखोल विश्लेषण करते आणि AI
              सहाय्याने त्वरित मार्गदर्शन देते.
            </p>
          </div>
          <button
            className="glass-button sm:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            {menuOpen ? "बंद करा" : "मेनू"}
          </button>
        </header>

        <div className="page-grid">
          <nav
            className={`glass-card h-full p-4 transition-all sm:p-6 ${
              menuOpen ? "block" : "hidden sm:block"
            }`}
          >
            <div className="space-y-3">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === activePath;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition ${
                      isActive
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)]/20"
                        : "border-transparent hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--card)]/70"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="text-xs text-[color:var(--muted)]">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <main className="glass-card min-h-[60vh] p-5 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

