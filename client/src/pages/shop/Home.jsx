import { ArrowRight, BadgePercent, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import Button from "../../components/ui/Button.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { getProducts } from "../../services/productService.js";
import { CATEGORY_OPTIONS } from "../../utils/categoryData.js";

const categoryImages = {
  Mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
  Electronics: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
  "Home & Furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
  Appliances: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=700&q=80",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
  Grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
  Sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=700&q=80",
  Books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
  Toys: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=700&q=80"
};

const promises = [
  { icon: Truck, title: "Fast delivery", text: "Quick shipping on daily essentials and high-demand picks." },
  { icon: ShieldCheck, title: "Easy returns", text: "Clear return and replacement policies on every product." },
  { icon: BadgePercent, title: "Fresh deals", text: "Discounted prices are calculated from real product data." },
  { icon: PackageCheck, title: "Stock aware", text: "Low-stock and out-of-stock items are shown before checkout." }
];

export default function Home() {
  usePageTitle("Home");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load featured products.");
      } finally {
        setLoading(false);
      }
    }

    loadHomeProducts();
  }, []);

  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const topDeals = products
    .filter((product) => product.stockQuantity > 0)
    .sort((first, second) => second.discountPercentage - first.discountPercentage)
    .slice(0, 8);

  return (
    <div className="space-y-10 pb-8">
      <section className="relative overflow-hidden rounded-md bg-ink text-white shadow-soft">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80"
          alt="Online shopping collection"
        />
        <div className="relative grid min-h-[430px] content-end gap-6 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-normal text-skysoft">Nilgit Store</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Fresh picks for every shelf, screen, and closet.</h1>
            <p className="max-w-xl text-base text-neutral-100 sm:text-lg">
              Shop phones, electronics, fashion, appliances, groceries, books, toys, and home essentials from one simple store.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button className="bg-white text-ink hover:bg-neutral-100">Shop all products</Button>
              </Link>
              <Link to="/products?category=Mobiles">
                <Button variant="secondary" className="border-white bg-transparent text-white hover:border-white">
                  Explore mobiles
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-md bg-white/95 p-4 text-ink">
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm text-neutral-600">Products across 10 categories</p>
            </div>
            <div className="rounded-md bg-white/95 p-4 text-ink">
              <p className="text-3xl font-bold">45%</p>
              <p className="text-sm text-neutral-600">Deals on selected picks</p>
            </div>
            <div className="rounded-md bg-white/95 p-4 text-ink">
              <p className="text-3xl font-bold">10</p>
              <p className="text-sm text-neutral-600">Departments to explore</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Shop by category</h2>
            <p className="mt-1 text-sm text-neutral-600">Start with a department and narrow down from there.</p>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-semibold text-ink sm:inline-flex">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_OPTIONS.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group overflow-hidden rounded-md border border-neutral-200 bg-white shadow-soft"
            >
              <img className="h-32 w-full object-cover transition duration-300 group-hover:scale-105" src={categoryImages[category.name]} alt={category.name} />
              <div className="p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{category.subcategories.slice(0, 3).join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-md bg-skysoft p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-clay">Seasonal deals</p>
            <h2 className="mt-2 text-3xl font-bold">Discounts without digging through pages.</h2>
            <p className="mt-2 text-neutral-700">
              Fresh markdowns from across the store, gathered in one quick row.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {topDeals.slice(0, 4).map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="rounded-md bg-white p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-normal text-clay">{product.brand}</p>
                <h3 className="mt-1 line-clamp-2 min-h-10 font-semibold">{product.name}</h3>
                <p className="mt-3 text-lg font-bold text-leaf">{product.discountPercentage}% off</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Featured picks</h2>
            <p className="mt-1 text-sm text-neutral-600">Popular choices for fast browsing.</p>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-semibold text-ink sm:inline-flex">
            Shop more <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-5">
          <ErrorMessage message={error} />
          {loading ? (
            <Loader label="Loading featured products..." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(featuredProducts.length ? featuredProducts : products.slice(0, 4)).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-md border border-neutral-200 bg-white p-5 shadow-soft">
              <Icon className="text-clay" size={28} />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
