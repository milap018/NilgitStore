import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { deleteProduct, getProducts } from "../../services/productService.js";
import { formatMoney } from "../../utils/formatMoney.js";
import { getPrimaryImage, getProductPrice, getStockLabel } from "../../utils/productUtils.js";

export default function AdminProducts() {
  usePageTitle("Admin Products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((oldProducts) => oldProducts.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  }

  if (loading) {
    return <Loader label="Loading admin products..." />;
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin products</h1>
          <p className="mt-1 text-neutral-600">Create, edit, and delete products.</p>
        </div>
        <Link to="/admin/products/add">
          <Button>
            <Plus size={18} className="mr-2" />
            Add product
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <ErrorMessage message={error} />
        <div className="overflow-x-auto rounded-md border border-gold-100 bg-white shadow-soft">
          <table className="min-w-full divide-y divide-gold-100 text-sm">
            <thead className="bg-gold-50 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img className="h-12 w-12 rounded-md object-cover" src={getPrimaryImage(product)} alt={product.name} />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.category} / {product.subcategory}</td>
                  <td className="px-4 py-3">{formatMoney(getProductPrice(product))}</td>
                  <td className="px-4 py-3">{product.stockQuantity} - {getStockLabel(product)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-200 transition hover:border-gold-500 hover:bg-gold-50"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        onClick={() => handleDelete(product._id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
