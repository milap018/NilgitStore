import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { uploadProductImages } from "../../services/productService.js";
import { CATEGORY_OPTIONS, getSubcategories } from "../../utils/categoryData.js";
import { calculateSellingPrice } from "../../utils/productUtils.js";

function parseLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpecifications(text) {
  return parseLines(text)
    .map((line) => {
      const [name, ...rest] = line.split(":");

      return {
        name: name?.trim(),
        value: rest.join(":").trim()
      };
    })
    .filter((item) => item.name && item.value);
}

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initialValues);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const subcategories = getSubcategories(form.category);

  useEffect(() => {
    setForm((oldForm) => ({
      ...oldForm,
      sellingPrice: calculateSellingPrice(oldForm.originalPrice, oldForm.discountPercentage)
    }));
  }, [form.originalPrice, form.discountPercentage]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleCategoryChange(event) {
    setForm({ ...form, category: event.target.value, subcategory: "" });
  }

  async function handleImageChange(event) {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const data = await uploadProductImages(files);
      setForm((oldForm) => ({
        ...oldForm,
        images: [...oldForm.images, ...data.imageUrls]
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(imageUrl) {
    setForm((oldForm) => ({
      ...oldForm,
      images: oldForm.images.filter((image) => image !== imageUrl)
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      originalPrice: Number(form.originalPrice),
      discountPercentage: Number(form.discountPercentage),
      sellingPrice: Number(form.sellingPrice),
      stockQuantity: Number(form.stockQuantity),
      rating: Number(form.rating),
      numberOfReviews: Number(form.numberOfReviews),
      highlights: parseLines(form.highlightsText),
      specifications: parseSpecifications(form.specificationsText)
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-gold-100 bg-white p-5 shadow-soft">
      <ErrorMessage message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="name" label="Product name" name="name" value={form.name} onChange={handleChange} required />
        <Input id="brand" label="Brand name" name="brand" value={form.brand} onChange={handleChange} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">Category</span>
          <select
            className="w-full rounded-md border border-gold-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">Subcategory</span>
          <select
            className="w-full rounded-md border border-gold-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100 disabled:bg-neutral-100"
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            required
            disabled={!form.category}
          >
            <option value="">Select subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Description</span>
        <textarea
          className="min-h-28 w-full rounded-md border border-gold-200 px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-4">
        <Input id="originalPrice" label="Original price" name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={handleChange} required />
        <Input id="discountPercentage" label="Discount %" name="discountPercentage" type="number" min="0" max="100" step="1" value={form.discountPercentage} onChange={handleChange} required />
        <Input id="sellingPrice" label="Selling price" name="sellingPrice" type="number" value={form.sellingPrice} readOnly />
        <Input id="stockQuantity" label="Stock quantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="rating" label="Rating" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
        <Input id="numberOfReviews" label="Number of reviews" name="numberOfReviews" type="number" min="0" value={form.numberOfReviews} onChange={handleChange} />
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Upload product images</span>
        <input className="w-full rounded-md border border-gold-200 bg-white px-3 py-2" type="file" accept="image/*" multiple onChange={handleImageChange} />
      </label>
      {uploading && <p className="text-sm text-neutral-600">Uploading image...</p>}
      {form.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {form.images.map((image) => (
            <div key={image} className="relative">
              <img className="h-32 w-full rounded-md object-cover" src={image} alt="Product preview" />
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-soft"
                onClick={() => removeImage(image)}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Product highlights</span>
        <textarea
          className="min-h-28 w-full rounded-md border border-gold-200 px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          name="highlightsText"
          value={form.highlightsText}
          onChange={handleChange}
          placeholder="One highlight per line"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Specifications</span>
        <textarea
          className="min-h-28 w-full rounded-md border border-gold-200 px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          name="specificationsText"
          value={form.specificationsText}
          onChange={handleChange}
          placeholder="RAM: 8 GB"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input id="sellerName" label="Seller name" name="sellerName" value={form.sellerName} onChange={handleChange} required />
        <Input id="deliveryInfo" label="Delivery info" name="deliveryInfo" value={form.deliveryInfo} onChange={handleChange} required />
        <Input id="returnPolicy" label="Return policy" name="returnPolicy" value={form.returnPolicy} onChange={handleChange} required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
        Featured product
      </label>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
