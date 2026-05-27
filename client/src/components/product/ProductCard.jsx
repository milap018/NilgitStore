import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
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
  const stockQuantity = getStockQuantity(product);

  return (
    <article className="flex h-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-soft">
      <div className="flex w-full flex-col">
      <Link to={`/products/${product._id}`}>
        <img className="h-56 w-full object-cover" src={getPrimaryImage(product)} alt={product.name} />
      </Link>
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-clay">{product.brand}</p>
          <Link to={`/products/${product._id}`} className="mt-1 block min-h-14 text-lg font-semibold text-ink line-clamp-2">
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-neutral-500">{product.category} / {product.subcategory}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded bg-leaf px-2 py-0.5 text-xs font-semibold text-white">{product.rating || 0} star</span>
          <span className="text-neutral-500">({product.numberOfReviews || 0})</span>
        </div>
        <div className="min-h-16 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold">{formatMoney(getProductPrice(product))}</span>
            <span className="text-sm text-neutral-500 line-through">{formatMoney(getOriginalPrice(product))}</span>
            <span className="text-sm font-semibold text-leaf">{product.discountPercentage || 0}% off</span>
          </div>
          <p className={`text-sm font-semibold ${getStockClass(product)}`}>{getStockLabel(product)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <Button
            onClick={() => addToCart(product)}
            disabled={stockQuantity === 0}
            className="w-full min-h-10 px-3"
          >
            Add to Cart
          </Button>
        </div>
      </div>
      </div>
    </article>
  );
}
