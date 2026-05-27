import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { formatMoney } from "../../utils/formatMoney.js";
import { getStockClass, getStockLabel } from "../../utils/productUtils.js";

export default function Cart() {
  usePageTitle("Cart");

  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const hasOutOfStockItem = cartItems.some((item) => (item.stockQuantity ?? item.countInStock) === 0);

  if (cartItems.length === 0) {
    return (
      <section className="rounded-md border border-neutral-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-neutral-600">Add a few products before checkout.</p>
        <Link to="/products" className="mt-5 inline-block">
          <Button>Browse products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-[100px_1fr_auto]">
              <img className="h-24 w-24 rounded-md object-cover" src={item.image} alt={item.name} />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                {item.brand && <p className="text-sm text-neutral-500">{item.brand}</p>}
                <p className="text-sm text-neutral-600">{formatMoney(item.price)}</p>
                <p className={`mt-1 text-sm font-semibold ${getStockClass(item)}`}>{getStockLabel(item)}</p>
                <input
                  className="mt-3 w-24 rounded-md border border-neutral-300 px-3 py-2"
                  type="number"
                  min="1"
                  max={item.stockQuantity ?? item.countInStock}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.product, event.target.value)}
                  disabled={(item.stockQuantity ?? item.countInStock) === 0}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 text-red-600"
                onClick={() => removeFromCart(item.product)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-md border border-neutral-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
            <span>Total</span>
            <strong>{formatMoney(cartTotal)}</strong>
          </div>
          {hasOutOfStockItem && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Remove out-of-stock items before checkout.
            </p>
          )}
          <Link to="/checkout" className="mt-5 block">
            <Button className="w-full" disabled={hasOutOfStockItem}>Checkout</Button>
          </Link>
        </aside>
      </div>
    </section>
  );
}
