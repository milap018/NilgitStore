import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getOriginalPrice, getPrimaryImage, getProductPrice, getStockQuantity } from "../utils/productUtils.js";

const WishlistContext = createContext(null);

function loadSavedWishlist() {
  try {
    const savedWishlist = localStorage.getItem("nilgit-wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    return [];
  }
}

function createWishlistItem(product) {
  const stockQuantity = getStockQuantity(product);

  return {
    _id: product._id,
    product: product._id,
    name: product.name,
    brand: product.brand,
    image: getPrimaryImage(product),
    price: getProductPrice(product),
    originalPrice: getOriginalPrice(product),
    discountPercentage: product.discountPercentage || 0,
    stockQuantity,
    countInStock: stockQuantity,
    category: product.category,
    subcategory: product.subcategory,
    rating: product.rating || 0,
    numberOfReviews: product.numberOfReviews || 0
  };
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(loadSavedWishlist);

  useEffect(() => {
    localStorage.setItem("nilgit-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback(function addToWishlist(product) {
    setWishlistItems((oldItems) => {
      const exists = oldItems.some((item) => item.product === product._id);

      if (exists) {
        return oldItems;
      }

      return [createWishlistItem(product), ...oldItems];
    });
  }, []);

  const removeFromWishlist = useCallback(function removeFromWishlist(productId) {
    setWishlistItems((oldItems) => oldItems.filter((item) => item.product !== productId));
  }, []);

  const toggleWishlist = useCallback(function toggleWishlist(product) {
    setWishlistItems((oldItems) => {
      const exists = oldItems.some((item) => item.product === product._id);

      if (exists) {
        return oldItems.filter((item) => item.product !== product._id);
      }

      return [createWishlistItem(product), ...oldItems];
    });
  }, []);

  const isInWishlist = useCallback(
    function isInWishlist(productId) {
      return wishlistItems.some((item) => item.product === productId);
    },
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist
    }),
    [wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
