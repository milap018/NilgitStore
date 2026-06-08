export function calculateSellingPrice(originalPrice, discountPercentage) {
  const price = Number(originalPrice) || 0;
  const discount = Number(discountPercentage) || 0;
  const sellingPrice = price - price * (discount / 100);

  return Math.max(0, Math.round(sellingPrice * 100) / 100);
}

export function getPrimaryImage(product) {
  return product?.images?.[0] || product?.image || "";
}

export function getProductPrice(product) {
  return product?.sellingPrice ?? product?.price ?? 0;
}

export function getOriginalPrice(product) {
  return product?.originalPrice ?? product?.price ?? 0;
}

export function getStockQuantity(product) {
  return product?.stockQuantity ?? product?.countInStock ?? 0;
}

export function getStockLabel(product) {
  const stockQuantity = getStockQuantity(product);

  if (stockQuantity === 0) {
    return "Out of Stock";
  }

  if (stockQuantity < 5) {
    return "Only few left";
  }

  return "In Stock";
}

export function getStockClass(product) {
  const stockQuantity = getStockQuantity(product);

  if (stockQuantity === 0) {
    return "text-red-600";
  }

  if (stockQuantity < 5) {
    return "text-gold-600";
  }

  return "text-gold-700";
}
