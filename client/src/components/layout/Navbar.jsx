import { Heart, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const linkClass = ({ isActive }) =>
  `inline-flex h-10 items-center rounded-md px-3 text-sm font-medium ${
    isActive ? "bg-gold-500 text-ink shadow-[0_8px_18px_rgba(217,154,0,0.22)]" : "text-neutral-700 hover:bg-gold-50 hover:text-ink"
  }`;

const headerIconClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-300 bg-white text-ink transition hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-100";

const headerActionClass =
  "inline-flex h-10 items-center gap-2 rounded-md border border-gold-300 bg-white px-3 text-sm font-medium text-ink transition hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-100";

const mobileActionClass =
  "flex h-10 items-center gap-2 rounded-md border border-gold-300 bg-white px-3 text-sm font-medium text-ink";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    function closeProfileMenu(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  async function handleLogout() {
    await logout();
    setOpen(false);
    setProfileOpen(false);
  }

  const links = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>
        Products
      </NavLink>
      <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
        About
      </NavLink>
      <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
        Contact
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin/products" className={linkClass} onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-gold-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-normal text-ink">
          Nilgit Store
        </Link>

        <div className="hidden items-center gap-2 md:flex">{links}</div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/wishlist"
            className={headerIconClass}
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>
          <Link
            to="/cart"
            className={headerActionClass}
          >
            <ShoppingCart size={18} />
            Cart {itemCount > 0 && <span>({itemCount})</span>}
          </Link>
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className={headerIconClass}
                onClick={() => setProfileOpen((value) => !value)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <UserRound size={19} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 z-40 w-44 overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm font-medium text-ink transition hover:bg-gold-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="inline-flex h-10 items-center rounded-md border border-gold-600 bg-gold-500 px-4 text-sm font-semibold text-ink shadow-[0_10px_22px_rgba(217,154,0,0.22)] transition hover:bg-gold-400">
              Signin
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="space-y-2 border-t border-gold-200 bg-white px-4 py-4 md:hidden">
          <div className="grid gap-2">{links}</div>
          {user && (
            <div className="rounded-md border border-gold-100 bg-gold-50 p-2">
              <div className="mb-2 flex items-center gap-2 px-2 py-1 text-sm font-semibold text-ink">
                <UserRound size={18} />
                Profile
              </div>
              <Link
                to="/profile"
                className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-white"
                onClick={() => setOpen(false)}
              >
                View profile
              </Link>
              <button
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
          <Link
            to="/wishlist"
            className={mobileActionClass}
            onClick={() => setOpen(false)}
          >
            <Heart size={18} />
            Wishlist
          </Link>
          <Link
            to="/cart"
            className={mobileActionClass}
            onClick={() => setOpen(false)}
          >
            <ShoppingCart size={18} />
            Cart {itemCount > 0 && <span>({itemCount})</span>}
          </Link>
          {!user && (
            <Link
              to="/signin"
              className="flex h-10 items-center justify-center rounded-md border border-gold-600 bg-gold-500 px-4 text-center text-sm font-semibold text-ink"
              onClick={() => setOpen(false)}
            >
              Signin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
