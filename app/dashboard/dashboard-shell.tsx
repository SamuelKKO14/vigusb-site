"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Wrench,
  Calendar,
  Store,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  ShieldAlert,
} from "lucide-react";

interface DashboardShellProps {
  user: { id: string; email: string };
  isAdmin: boolean;
  magasins: { id: string; code: string; nom: string; ville: string }[];
  fallbackCount?: number;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard/reparations", label: "Réparations", icon: Wrench },
  { href: "/dashboard/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/magasins-admin", label: "Magasins", icon: Store, adminOnly: true },
  { href: "/dashboard/staff", label: "Staff", icon: Users, adminOnly: true },
  { href: "/dashboard/fallback", label: "Fallback", icon: ShieldAlert, adminOnly: true },
];

export function DashboardShell({
  user,
  isAdmin,
  magasins,
  fallbackCount = 0,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const filteredNav = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const activeMagasin = magasins[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold text-lg">
          Vigus<span className="text-vert">&apos;</span>B
        </span>
        <div className="w-9" />
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="font-bold text-lg">
            Vigus<span className="text-vert">&apos;</span>B
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Magasin actif */}
        <div className="border-b px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {isAdmin ? "Admin global" : "Magasin"}
          </p>
          <p className="text-sm font-semibold truncate">
            {isAdmin
              ? "Tous les magasins"
              : activeMagasin
                ? `${activeMagasin.nom} — ${activeMagasin.ville}`
                : "Non affecté"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet text-white"
                    : "text-gray-700 hover:bg-violet/10"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.href === "/dashboard/fallback" && fallbackCount > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                    {fallbackCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {user.email}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      <Toaster />
    </div>
  );
}
