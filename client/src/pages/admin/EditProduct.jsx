import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { getProduct, updateProduct } from "../../services/productService.js";
import ProductForm from "./ProductForm.jsx";

export default function EditProduct() {
  usePageTitle("Edit Product");

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct({
          name: data.name,
          brand: data.brand,
          category: data.category,
          subcategory: data.subcategory,
          description: data.description,
          originalPrice: data.originalPrice,
          discountPercentage: data.discountPercentage,
          sellingPrice: data.sellingPrice,
          stockQuantity: data.stockQuantity,
          images: data.images || [],
          rating: data.rating || 0,
          numberOfReviews: data.numberOfReviews || 0,
          highlightsText: data.highlights?.join("\n") || "",
          specificationsText:
            data.specifications?.map((item) => `${item.name}: ${item.value}`).join("\n") || "",
          deliveryInfo: data.deliveryInfo,
          returnPolicy: data.returnPolicy,
          sellerName: data.sellerName,
          featured: data.featured
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(form) {
    setError("");

    try {
      await updateProduct(id, form);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Update product failed.");
    }
  }

  if (loading) {
    return <Loader label="Loading product..." />;
  }

  if (!product) {
    return <ErrorMessage message={error || "Product not found."} />;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Edit product</h1>
      <ErrorMessage message={error} />
      <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save changes" />
    </section>
  );
}
