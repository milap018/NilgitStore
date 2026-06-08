import { CATEGORY_OPTIONS } from "./categoryData.js";

const categoryImages = {
  Mobiles: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  ],
  "Home & Furniture": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  ],
  Appliances: [
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80"
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
  ],
  Grocery: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=80"
  ],
  Sports: [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80"
  ],
  Books: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80"
  ],
  Toys: [
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"
  ]
};

const names = [
  "Everyday Smart Pick",
  "Premium Choice",
  "Budget Friendly Pack",
  "Pro Series",
  "Daily Essential",
  "Classic Edition",
  "Compact Plus",
  "Family Value Set",
  "Travel Ready Kit",
  "Starter Combo"
];

const brands = ["Samsung", "Sony", "Roadster", "LG", "Nilgit", "Puma", "Tata", "Penguin", "Funskool", "Wakefit"];

export const demoProducts = CATEGORY_OPTIONS.flatMap((category, categoryIndex) =>
  names.map((name, index) => {
    const originalPrice = 499 + categoryIndex * 1400 + index * 350;
    const discountPercentage = [10, 15, 20, 25, 30, 35, 40, 45, 18, 22][index];
    const sellingPrice = Math.round((originalPrice - originalPrice * (discountPercentage / 100)) * 100) / 100;
    const stockQuantity = index === 9 ? 0 : index % 4 === 0 ? 3 : 8 + index;
    const brand = brands[(categoryIndex + index) % brands.length];
    const subcategory = category.subcategories[index % category.subcategories.length];

    return {
      _id: `${categoryIndex + 1}${index + 1}`.padStart(24, "0"),
      name: `${category.name} ${name}`,
      brand,
      category: category.name,
      subcategory,
      description: `${category.name} ${name} from ${brand}, made for everyday shopping and learning demos.`,
      originalPrice,
      sellingPrice,
      discountPercentage,
      stockQuantity,
      images: categoryImages[category.name],
      rating: Math.round((4 + (index % 7) * 0.1) * 10) / 10,
      numberOfReviews: 120 + index * 87,
      highlights: ["Demo catalog item", `Best for ${subcategory}`, "Value-for-money pricing"],
      specifications: [
        { name: "Brand", value: brand },
        { name: "Category", value: category.name },
        { name: "Subcategory", value: subcategory }
      ],
      deliveryInfo: "Delivery within 3-6 days",
      returnPolicy: "7 days replacement policy",
      sellerName: `${brand} Demo Seller`,
      status: stockQuantity > 0 ? "in stock" : "out of stock",
      featured: index < 2
    };
  })
);

export function getDemoProducts(params = {}) {
  const search = (params.search || "").toLowerCase();

  return demoProducts.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search);
    const matchesCategory = !params.category || product.category === params.category;
    const matchesSubcategory = !params.subcategory || product.subcategory === params.subcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });
}

export function getDemoProduct(id) {
  return demoProducts.find((product) => product._id === id);
}
