import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Button from "../ui/Button.jsx";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-ink text-white" : "text-neutral-700 hover:bg-neutral-100"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  async function handleLogout() {
    await logout();
    setOpen(false);
  }

  const links = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>
        Products
      </NavLink>
      {user && (
        <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
          Orders
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin/products" className={linkClass} onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-normal text-ink">
          Nilgit Store
        </Link>

        <div className="hidden items-center gap-2 md:flex">{links}</div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium"
          >
            <ShoppingCart size={18} />
            Cart {itemCount > 0 && <span>({itemCount})</span>}
          </Link>
          {user ? (
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/signin" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
              Signin
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="space-y-2 border-t border-neutral-200 bg-white px-4 py-4 md:hidden">
          <div className="grid gap-2">{links}</div>
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <ShoppingCart size={18} />
            Cart {itemCount > 0 && <span>({itemCount})</span>}
          </Link>
          {user ? (
            <Button variant="secondary" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link
              to="/signin"
              className="block rounded-md bg-ink px-4 py-2 text-center text-sm font-semibold text-white"
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
