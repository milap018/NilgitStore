import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator(images) {
          return images.length > 0;
        },
        message: "At least one product image is required."
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numberOfReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    highlights: {
      type: [String],
      default: []
    },
    specifications: {
      type: [specificationSchema],
      default: []
    },
    deliveryInfo: {
      type: String,
      required: true,
      trim: true
    },
    returnPolicy: {
      type: String,
      required: true,
      trim: true
    },
    sellerName: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "in stock"
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

productSchema.pre("validate", function setDerivedProductFields(next) {
  const discountAmount = this.originalPrice * (this.discountPercentage / 100);

  this.sellingPrice = Math.round((this.originalPrice - discountAmount) * 100) / 100;
  this.status = this.stockQuantity > 0 ? "in stock" : "out of stock";

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
