import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    shippingAddress: shippingAddressSchema,
    totalAmount: {
      type: Number,
      required: true
    },
    paymentProvider: {
      type: String,
      default: "stripe"
    },
    paymentSessionId: String,
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
