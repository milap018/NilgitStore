import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import QuantityStepper from "../../components/ui/QuantityStepper.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { formatMoney } from "../../utils/formatMoney.js";
import { getStockClass, getStockLabel } from "../../utils/productUtils.js";

export default function Cart() {
  usePageTitle("Cart");

  const { addToCart, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { wishlistItems } = useWishlist();
  const hasOutOfStockItem = cartItems.some((item) => (item.stockQuantity ?? item.countInStock) === 0);

  const wishlistRow = (
    <div className="rounded-md border border-gold-100 bg-white p-4 shadow-soft">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-gold-700" size={20} fill="currentColor" />
          <h2 className="font-semibold">Add your favourite item from wishlist</h2>
        </div>
        <Link to="/wishlist" className="text-sm font-semibold text-gold-700">
          View wishlist
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">Save products with the heart icon, then add them to cart from here.</p>
      ) : (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {wishlistItems.slice(0, 5).map((item) => {
            const isOutOfStock = (item.stockQuantity ?? item.countInStock) === 0;

            return (
              <article key={item.product} className="flex min-w-[245px] items-center gap-3 rounded-md border border-gold-100 bg-gold-50/50 p-3">
                <Link to={`/products/${item.product}`} className="shrink-0">
                  <img className="h-14 w-14 rounded-md object-cover" src={item.image} alt={item.name} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.product}`} className="block truncate text-sm font-semibold text-ink">
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-600">{formatMoney(item.price)}</p>
                  <p className={`text-xs font-semibold ${getStockClass(item)}`}>{getStockLabel(item)}</p>
                </div>
                <Button
                  className="min-h-9 shrink-0 gap-1 px-3 text-xs"
                  onClick={() => addToCart(item)}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart size={14} />
                  Add
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <section className="space-y-5">
        <div className="rounded-md border border-gold-100 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-neutral-600">Add a few products before checkout.</p>
          <Link to="/products" className="mt-5 inline-block">
            <Button>Browse products</Button>
          </Link>
        </div>
        {wishlistRow}
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Cart</h1>

      <div className="mt-5">{wishlistRow}</div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="grid gap-4 rounded-md border border-gold-100 bg-white p-4 sm:grid-cols-[100px_1fr_auto]">
              <img className="h-24 w-24 rounded-md object-cover" src={item.image} alt={item.name} />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                {item.brand && <p className="text-sm text-neutral-500">{item.brand}</p>}
                <p className="text-sm text-neutral-600">{formatMoney(item.price)}</p>
                <p className={`mt-1 text-sm font-semibold ${getStockClass(item)}`}>{getStockLabel(item)}</p>
                <QuantityStepper
                  className="mt-3"
                  value={item.quantity}
                  max={item.stockQuantity ?? item.countInStock}
                  onChange={(nextQuantity) => updateQuantity(item.product, nextQuantity)}
                  disabled={(item.stockQuantity ?? item.countInStock) === 0}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                onClick={() => removeFromCart(item.product)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-md border border-gold-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="mt-4 flex justify-between border-t border-gold-100 pt-4">
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
