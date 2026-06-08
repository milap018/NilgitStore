import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getOriginalPrice, getPrimaryImage, getProductPrice, getStockQuantity } from "../utils/productUtils.js";

const CartContext = createContext(null);

function loadSavedCart() {
  try {
    const savedCart = localStorage.getItem("nilgit-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadSavedCart);

  useEffect(() => {
    localStorage.setItem("nilgit-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback(function addToCart(product, quantity = 1) {
    setCartItems((oldItems) => {
      const productId = product._id ?? product.product;
      const stockQuantity = getStockQuantity(product);
      const safeQuantity = Math.max(1, Math.min(Number(quantity) || 1, stockQuantity));

      if (stockQuantity === 0) {
        return oldItems;
      }

      const existingItem = oldItems.find((item) => item.product === productId);

      if (existingItem) {
        return oldItems.map((item) =>
          item.product === productId
            ? { ...item, quantity: Math.min(item.quantity + safeQuantity, stockQuantity), stockQuantity }
            : item
        );
      }

      return [
        ...oldItems,
        {
          product: productId,
          name: product.name,
          brand: product.brand,
          image: getPrimaryImage(product),
          price: getProductPrice(product),
          originalPrice: getOriginalPrice(product),
          discountPercentage: product.discountPercentage || 0,
          stockQuantity,
          countInStock: stockQuantity,
          quantity: safeQuantity
        }
      ];
    });
  }, []);

  const removeFromCart = useCallback(function removeFromCart(productId) {
    setCartItems((oldItems) => oldItems.filter((item) => item.product !== productId));
  }, []);

  const updateQuantity = useCallback(function updateQuantity(productId, quantity) {
    const safeQuantity = Number(quantity) || 1;

    setCartItems((oldItems) =>
      oldItems.map((item) => {
        if (item.product !== productId) {
          return item;
        }

        const maxQuantity = item.stockQuantity ?? item.countInStock ?? safeQuantity;

        return { ...item, quantity: Math.max(1, Math.min(safeQuantity, maxQuantity)) };
      })
    );
  }, []);

  const clearCart = useCallback(function clearCart() {
    setCartItems([]);
  }, []);

  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { itemCount, cartTotal };
  }, [cartItems]);

  const value = {
    cartItems,
    itemCount: totals.itemCount,
    cartTotal: totals.cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
