"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, PlusIcon, WalletIcon } from "@/components/Icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/add", label: "Add Expense", icon: PlusIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <WalletIcon className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              Expense<span className="text-indigo-600">Tracker</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/dashboard/add"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:hidden"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="px-2 pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <nav className="space-y-1" aria-label="Sidebar navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
              Keep every expense in one place and stay on top of your spending.
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium ${
                active ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="h-16 sm:hidden" />
    </div>
  );
}
