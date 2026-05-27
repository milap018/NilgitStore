import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { createProduct } from "../../services/productService.js";
import ProductForm from "./ProductForm.jsx";

const blankProduct = {
  name: "",
  brand: "",
  category: "",
  subcategory: "",
  description: "",
  originalPrice: "",
  discountPercentage: "",
  sellingPrice: 0,
  stockQuantity: "",
  images: [],
  rating: 0,
  numberOfReviews: 0,
  highlightsText: "",
  specificationsText: "",
  deliveryInfo: "",
  returnPolicy: "",
  sellerName: "",
  featured: false
};

export default function AddProduct() {
  usePageTitle("Add Product");

  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(form) {
    setError("");

    try {
      await createProduct(form);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Create product failed.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Add product</h1>
      <ErrorMessage message={error} />
      <ProductForm initialValues={blankProduct} onSubmit={handleSubmit} submitLabel="Create product" />
    </section>
  );
}
