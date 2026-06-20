import { BarChart3, Calculator, Leaf, LogOut, Medal, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  onLogout: () => void;
};

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: Leaf },
  { label: "Carbon Calculator", path: "/calculator", icon: Calculator },
  { label: "Insights", path: "/insights", icon: BarChart3 },
  { label: "Eco Coach", path: "/coach", icon: Sparkles },
  { label: "Achievements", path: "/achievements", icon: Medal },
] as const;

export default function Layout({ children, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4fff9] text-forest">
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-seafoam/60 bg-white/92 backdrop-blur-xl lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-r lg:border-t-0">
        <div className="hidden px-7 pb-8 pt-8 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-forest text-aquamarine shadow-glow">
              <Leaf size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold">CarbonWise</p>
              <p className="text-sm text-moss">Environmental tracker</p>
            </div>
          </div>
        </div>

        <nav className="grid grid-cols-5 gap-1 px-2 py-2 lg:flex lg:flex-col lg:px-4 lg:py-0" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group flex min-h-14 items-center justify-center rounded-lg px-2 text-xs font-semibold transition lg:justify-start lg:gap-3 lg:px-4 lg:text-sm",
                    isActive
                      ? "bg-forest text-aquamarine shadow-glow"
                      : "text-moss hover:bg-seafoam/45 hover:text-forest",
                  ].join(" ")
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden p-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:block">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-seafoam bg-white px-4 py-3 text-sm font-bold text-forest transition hover:border-jade hover:bg-mint/25"
          >
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-seafoam/60 bg-white/86 px-5 py-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={22} aria-hidden="true" />
            <span className="text-lg font-bold">CarbonWise</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-seafoam p-2 text-forest transition hover:bg-mint/25"
            aria-label="Logout"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:ml-72 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
    </div>
  );
}
