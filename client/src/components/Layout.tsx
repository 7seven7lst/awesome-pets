import { useEffect, useId, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROUTES } from "../lib/routes";
import {
  topNav,
  topNavBack,
  topNavLinkClass,
  topNavLogo,
  topNavMobilePanel,
  topNavSignOut,
  topNavSignOutMobile,
} from "../lib/ui-styles";

function MenuIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const NAV = [
  { to: ROUTES.dashboard, label: "Dashboard", end: true },
  { to: ROUTES.petList, label: "Pets" },
] as const;

function isNavActive(pathname: string, to: string): boolean {
  if (to === ROUTES.dashboard) return pathname === ROUTES.dashboard;
  if (to === ROUTES.petList) {
    return pathname === ROUTES.petList || (pathname.startsWith("/pets/") && !pathname.startsWith(ROUTES.petNew));
  }
  return false;
}

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  async function onSignOut() {
    await signOut();
    navigate(ROUTES.signIn, { replace: true });
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 shadow-sm">
        <nav className={topNav} aria-label="Primary">
          <div className="flex shrink-0 items-center gap-3">
            <NavLink to={ROUTES.dashboard} className="flex shrink-0 items-center" end aria-label="Dashboard home">
              <img src="/paw.svg" alt="" className={topNavLogo} width={40} height={40} />
            </NavLink>
            <button
              type="button"
              className={topNavBack}
              aria-label="Go back to previous page"
              onClick={() => {
                setMenuOpen(false);
                navigate(-1);
              }}
            >
              ← Back
            </button>
          </div>

          {/* Desktop — matches fullstack `hidden … sm:flex` */}
          <div className="hidden flex-1 items-center justify-end gap-8 sm:flex">
            <ul className="flex list-none items-center justify-end gap-8">
              {NAV.map((item) => {
                const active = isNavActive(pathname, item.to);
                return (
                  <li key={item.to}>
                    <NavLink to={item.to} end={"end" in item && item.end} className={() => topNavLinkClass(active)}>
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-3 border-l border-white/20 pl-8">
              <span className="max-w-[180px] truncate text-sm text-white" title={user?.email}>
                {user?.name}
              </span>
              <button type="button" className={topNavSignOut} onClick={() => void onSignOut()}>
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile — hamburger + dropdown (fullstack pattern) */}
          <div className="relative flex flex-1 justify-end sm:hidden">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-white"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {menuOpen ? (
              <div id={menuId} className={topNavMobilePanel}>
                <ul className="flex flex-col gap-4">
                  {NAV.map((item) => {
                    const active = isNavActive(pathname, item.to);
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={"end" in item && item.end}
                          className={() => topNavLinkClass(active)}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                  <li className="border-t border-white/10 pt-4">
                    <p className="mb-2 truncate text-xs text-white" title={user?.email}>
                      {user?.name}
                    </p>
                    <button type="button" className={topNavSignOutMobile} onClick={() => void onSignOut()}>
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
