import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { getProduct } from "../../services/productService.js";
import { formatMoney } from "../../utils/formatMoney.js";
import {
  getOriginalPrice,
  getPrimaryImage,
  getProductPrice,
  getStockClass,
  getStockLabel,
  getStockQuantity
} from "../../utils/productUtils.js";

export default function ProductDetails() {
  usePageTitle("Product Details");

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
        setSelectedImage(getPrimaryImage(data));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loader label="Loading product..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const stockQuantity = getStockQuantity(product);

  function handleBuyNow() {
    addToCart(product, quantity);
    navigate("/checkout");
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4">
        <img className="h-[420px] w-full rounded-md object-cover" src={selectedImage} alt={product.name} />
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <button
              type="button"
              key={image}
              className={`rounded-md border p-1 ${selectedImage === image ? "border-ink" : "border-neutral-200"}`}
              onClick={() => setSelectedImage(image)}
            >
              <img className="h-20 w-full rounded object-cover" src={image} alt={product.name} />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <Link to="/products" className="text-sm font-semibold text-clay">
          Back to products
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-clay">{product.brand}</p>
          <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-sm text-neutral-500">{product.category} / {product.subcategory}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded bg-leaf px-2 py-0.5 text-xs font-semibold text-white">{product.rating || 0} star</span>
          <span className="text-neutral-500">{product.numberOfReviews || 0} reviews</span>
        </div>
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-bold">{formatMoney(getProductPrice(product))}</p>
            <p className="text-lg text-neutral-500 line-through">{formatMoney(getOriginalPrice(product))}</p>
            <p className="font-semibold text-leaf">{product.discountPercentage || 0}% off</p>
          </div>
          <p className={`mt-2 text-sm font-semibold ${getStockClass(product)}`}>{getStockLabel(product)}</p>
        </div>
        <p className="text-neutral-600">{product.description}</p>

        {product.highlights?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Highlights</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {product.specifications?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Specifications</h2>
            <div className="mt-2 overflow-hidden rounded-md border border-neutral-200">
              {product.specifications.map((specification) => (
                <div key={`${specification.name}-${specification.value}`} className="grid grid-cols-[140px_1fr] border-b border-neutral-200 last:border-b-0">
                  <span className="bg-neutral-50 px-3 py-2 text-sm font-medium">{specification.name}</span>
                  <span className="px-3 py-2 text-sm text-neutral-600">{specification.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-600 sm:grid-cols-3">
          <p><span className="block font-semibold text-ink">Delivery</span>{product.deliveryInfo}</p>
          <p><span className="block font-semibold text-ink">Returns</span>{product.returnPolicy}</p>
          <p><span className="block font-semibold text-ink">Seller</span>{product.sellerName}</p>
        </div>

        <div className="flex max-w-xs items-end gap-3">
          <label className="block flex-1">
            <span className="mb-1 block text-sm font-medium">Quantity</span>
            <input
              className="w-full rounded-md border border-neutral-300 px-3 py-2"
              type="number"
              min="1"
              max={stockQuantity}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              disabled={stockQuantity === 0}
            />
          </label>
          <Button onClick={() => addToCart(product, quantity)} disabled={stockQuantity === 0}>
            Add to cart
          </Button>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleBuyNow} disabled={stockQuantity === 0}>
          Buy Now
        </Button>
      </div>
    </section>
  );
}
