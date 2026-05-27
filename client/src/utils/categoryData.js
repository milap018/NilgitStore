export const CATEGORY_OPTIONS = [
  {
    name: "Mobiles",
    subcategories: ["Smartphones", "Feature Phones", "Mobile Accessories"]
  },
  {
    name: "Electronics",
    subcategories: ["Laptops", "Cameras", "Headphones", "Smart Watches"]
  },
  {
    name: "Fashion",
    subcategories: ["Men", "Women", "Kids", "Shoes"]
  },
  {
    name: "Home & Furniture",
    subcategories: ["Furniture", "Home Decor", "Kitchen Storage", "Bedding"]
  },
  {
    name: "Appliances",
    subcategories: ["Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves"]
  },
  {
    name: "Beauty",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"]
  },
  {
    name: "Grocery",
    subcategories: ["Staples", "Snacks", "Beverages", "Personal Care"]
  },
  {
    name: "Sports",
    subcategories: ["Fitness", "Cricket", "Football", "Cycling"]
  },
  {
    name: "Books",
    subcategories: ["Fiction", "Non Fiction", "Academic", "Children"]
  },
  {
    name: "Toys",
    subcategories: ["Soft Toys", "Learning Toys", "Action Figures", "Board Games"]
  }
];

export function getSubcategories(categoryName) {
  return CATEGORY_OPTIONS.find((category) => category.name === categoryName)?.subcategories || [];
}
