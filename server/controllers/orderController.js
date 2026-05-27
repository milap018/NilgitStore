import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "../config/stripe.js";

function makeLineItems(items) {
  return items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : []
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.quantity
  }));
}

export async function createCheckoutSession(req, res) {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product id in cart." });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.stockQuantity === 0) {
        return res.status(400).json({ message: `${product.name} is out of stock.` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Only ${product.stockQuantity} ${product.name} left.` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.sellingPrice,
        quantity: Number(item.quantity)
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: makeLineItems(orderItems),
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId: order._id.toString()
      }
    });

    order.paymentSessionId = session.id;
    await order.save();

    res.status(201).json({
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session id is required." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = await Order.findOne({ paymentSessionId: sessionId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot verify this order." });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment is not completed." });
    }

    if (!order.isPaid) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product || product.stockQuantity < item.quantity) {
          return res.status(400).json({ message: `${item.name} does not have enough stock.` });
        }
      }

      for (const item of order.items) {
        const product = await Product.findById(item.product);
        product.stockQuantity -= item.quantity;
        await product.save();
      }

      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
    }

    res.json({ message: "Payment verified.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
