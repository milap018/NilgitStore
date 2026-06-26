import mongoose from "mongoose";
import Product from "../models/Product.js";
import { products as fallbackProducts } from "../seed/seedData.js";

// The fallback list is filtered the same way the database list is filtered.
function getFallbackProducts({ search = "", category = "", subcategory = "" }) {
  const searchText = search.toLowerCase();

  return fallbackProducts.filter((product) => {
    const matchesSearch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText);
    const matchesCategory = !category || product.category === category;
    const matchesSubcategory = !subcategory || product.subcategory === subcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

function cleanSpecifications(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      name: String(item.name || "").trim(),
      value: String(item.value || "").trim()
    }))
    .filter((item) => item.name && item.value);
}

// Normalize request input so the controller works with form fields and JSON bodies the same way.
function getProductBody(body) {
  return {
    name: body.name,
    brand: body.brand,
    category: body.category,
    subcategory: body.subcategory,
    description: body.description,
    originalPrice: Number(body.originalPrice || 0),
    discountPercentage: Number(body.discountPercentage || 0),
    stockQuantity: Number(body.stockQuantity || 0),
    images: cleanStringArray(body.images),
    rating: Number(body.rating || 0),
    numberOfReviews: Number(body.numberOfReviews || 0),
    highlights: cleanStringArray(body.highlights),
    specifications: cleanSpecifications(body.specifications),
    deliveryInfo: body.deliveryInfo,
    returnPolicy: body.returnPolicy,
    sellerName: body.sellerName,
    featured: Boolean(body.featured)
  };
}

// GET /products serves either Mongo data or seeded demo data, depending on database availability.
export async function getProducts(req, res) {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const subcategory = req.query.subcategory || "";

// When Mongo is unavailable, return seeded demo data instead of failing the UI.
    if (req.dbError) {
      return res.json(getFallbackProducts({ search, category, subcategory }));
    }

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET /products/:id follows the same fallback idea as the list endpoint.
export async function getProductById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    if (req.dbError) {
      const product = fallbackProducts.find((item) => item._id === req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      return res.json(product);
    }

// This is the normal Mongo path when the database is connected.
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const productBody = getProductBody(req.body);

    if (
      !productBody.name ||
      !productBody.brand ||
      !productBody.category ||
      !productBody.subcategory ||
      !productBody.description ||
      !productBody.originalPrice ||
      !productBody.images.length ||
      !productBody.deliveryInfo ||
      !productBody.returnPolicy ||
      !productBody.sellerName
    ) {
      return res.status(400).json({ message: "Please fill all required product fields." });
    }

    const product = await Product.create(productBody);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const productBody = getProductBody(req.body);
    const fields = [
      "name",
      "brand",
      "category",
      "subcategory",
      "description",
      "originalPrice",
      "discountPercentage",
      "stockQuantity",
      "images",
      "rating",
      "numberOfReviews",
      "highlights",
      "specifications",
      "deliveryInfo",
      "returnPolicy",
      "sellerName",
      "featured"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = productBody[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
