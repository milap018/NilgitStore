import { useEffect, useRef, useState } from "react";
import { Check, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { formatMoney } from "../../utils/formatMoney.js";
import {
  getOriginalPrice,
  getPrimaryImage,
  getProductPrice,
  getStockClass,
  getStockLabel,
  getStockQuantity
} from "../../utils/productUtils.js";
import Button from "../ui/Button.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef(null);
  const stockQuantity = getStockQuantity(product);
  const isOutOfStock = stockQuantity === 0;
  const isFavorite = isInWishlist(product._id);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);

    // Reset the success state so the button is ready for the next click.
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAdded(false);
    }, 1400);
  }

  useEffect(() => {
    return () => clearTimeout(resetTimer.current);
  }, []);

  return (
    <article className="flex h-full overflow-hidden rounded-md border border-gold-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_18px_34px_rgba(168,117,0,0.16)]">
      <div className="flex w-full flex-col">
        <div className="relative">
          <Link to={`/products/${product._id}`}>
            <img className="h-56 w-full object-cover" src={getPrimaryImage(product)} alt={product.name} />
          </Link>
          <button
            type="button"
            className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 shadow-soft transition hover:scale-105 ${
              isFavorite ? "border-gold-500 text-gold-700" : "border-gold-200 text-neutral-600 hover:text-gold-700"
            }`}
            onClick={() => toggleWishlist(product)}
            aria-label={isFavorite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex flex-1 flex-col space-y-3 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-gold-700">{product.brand}</p>
            <Link to={`/products/${product._id}`} className="mt-1 block min-h-14 text-lg font-semibold text-ink line-clamp-2">
              {product.name}
            </Link>
            <p className="mt-1 text-xs text-neutral-500">{product.category} / {product.subcategory}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded bg-gold-600 px-2 py-0.5 text-xs font-semibold text-white">{product.rating || 0} star</span>
            <span className="text-neutral-500">({product.numberOfReviews || 0})</span>
          </div>
          <div className="min-h-16 space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold">{formatMoney(getProductPrice(product))}</span>
              <span className="text-sm text-neutral-500 line-through">{formatMoney(getOriginalPrice(product))}</span>
              <span className="text-sm font-semibold text-gold-700">{product.discountPercentage || 0}% off</span>
            </div>
            <p className={`text-sm font-semibold ${getStockClass(product)}`}>{getStockLabel(product)}</p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`group relative w-full min-h-12 overflow-hidden px-3 shadow-sm transition-all duration-300 active:scale-[0.98] ${
                isOutOfStock
                  ? "bg-neutral-300 text-neutral-600 hover:bg-neutral-300"
                  : added
                    ? "bg-gold-700 text-white hover:bg-gold-700 shadow-[0_12px_24px_rgba(168,117,0,0.28)]"
                    : "bg-[linear-gradient(135deg,#ffe08a,#d99a00,#a87500)] text-ink hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(217,154,0,0.28)]"
              }`}
            >
              {!isOutOfStock && (
                <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[420%]" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {isOutOfStock ? (
                  "Out of Stock"
                ) : added ? (
                  <>
                    <Check size={18} className="animate-bounce" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                    Add to Cart
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
