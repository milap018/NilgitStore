import mongoose from "mongoose";
import Product from "../models/Product.js";

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

export async function getProducts(req, res) {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const subcategory = req.query.subcategory || "";

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

export async function getProductById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

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
