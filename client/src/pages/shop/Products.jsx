import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { getProducts } from "../../services/productService.js";
import { CATEGORY_OPTIONS, getSubcategories } from "../../utils/categoryData.js";

export default function Products() {
  usePageTitle("Products");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts({ search, category, subcategory });
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category, subcategory]);

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setSubcategory("");
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-neutral-600">Loaded from MongoDB through the Express API.</p>
        </div>
        <div className="grid w-full gap-3 sm:max-w-3xl sm:grid-cols-3">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-3 outline-none focus:border-ink focus:ring-2 focus:ring-skysoft"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-ink focus:ring-2 focus:ring-skysoft"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-ink focus:ring-2 focus:ring-skysoft disabled:bg-neutral-100"
            value={subcategory}
            onChange={(event) => setSubcategory(event.target.value)}
            disabled={!category}
          >
            <option value="">All subcategories</option>
            {getSubcategories(category).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <ErrorMessage message={error} />
        {loading ? (
          <Loader label="Loading products..." />
        ) : products.length === 0 ? (
          <p className="rounded-md border border-neutral-200 bg-white p-6 text-neutral-600">No products found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
