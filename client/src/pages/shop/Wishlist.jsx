import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { formatMoney } from "../../utils/formatMoney.js";
import { getStockClass, getStockLabel } from "../../utils/productUtils.js";

export default function Wishlist() {
  usePageTitle("Wishlist");

  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const wishlistCount = wishlistItems.length;

  if (wishlistItems.length === 0) {
    return (
      <section className="rounded-md border border-gold-100 bg-white p-8 text-center shadow-soft">
        <Heart className="mx-auto text-gold-600" size={36} />
        <h1 className="mt-4 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-neutral-600">Tap the heart on a product to save it for later.</p>
        <Link to="/products" className="mt-5 inline-block">
          <Button>Browse products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="mt-1 text-neutral-600">
            {wishlistCount} saved {wishlistCount === 1 ? "item" : "items"} for quick shopping.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gold-300 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-50"
        >
          Continue shopping
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {wishlistItems.map((item) => {
          const isOutOfStock = (item.stockQuantity ?? item.countInStock) === 0;

          return (
            <article
              key={item.product}
              className="grid gap-4 rounded-md border border-gold-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-gold-300 sm:grid-cols-[118px_1fr_auto] sm:items-center"
            >
              <Link to={`/products/${item.product}`} className="block">
                <img className="h-28 w-full rounded-md object-cover sm:h-24" src={item.image} alt={item.name} />
              </Link>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-normal text-gold-700">{item.brand}</p>
                <Link to={`/products/${item.product}`} className="mt-1 block text-lg font-semibold text-ink">
                  {item.name}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="font-semibold">{formatMoney(item.price)}</p>
                  {item.originalPrice > item.price && (
                    <p className="text-sm text-neutral-500 line-through">{formatMoney(item.originalPrice)}</p>
                  )}
                  <p className={`text-sm font-semibold ${getStockClass(item)}`}>{getStockLabel(item)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Button className="min-h-10 gap-2 px-4" onClick={() => addToCart(item)} disabled={isOutOfStock}>
                  <ShoppingCart size={17} />
                  Add to Cart
                </Button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                  onClick={() => removeFromWishlist(item.product)}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
