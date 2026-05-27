import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDb } from "../config/db.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const categoryCatalog = [
  {
    category: "Mobiles",
    subcategories: ["Smartphones", "Feature Phones", "Mobile Accessories"],
    brands: ["Samsung", "Apple", "OnePlus", "Realme", "Motorola"],
    names: [
      "Galaxy M35 5G",
      "iPhone 15",
      "OnePlus Nord CE4",
      "Realme Narzo 70 Pro",
      "Moto G Power 5G",
      "Nokia Classic 2660",
      "FastCharge USB-C Adapter",
      "MagSafe Clear Back Cover",
      "Bluetooth Selfie Stick",
      "Tempered Glass Screen Guard"
    ],
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 14999
  },
  {
    category: "Electronics",
    subcategories: ["Laptops", "Cameras", "Headphones", "Smart Watches"],
    brands: ["HP", "Canon", "Sony", "Boat", "Noise"],
    names: [
      "Pavilion 15 Ryzen Laptop",
      "EOS Mirrorless Camera",
      "AirLite Noise Cancelling Headphones",
      "Wave Pro Smart Watch",
      "Studio Bluetooth Speaker",
      "UltraSharp 24 Monitor",
      "Wireless Keyboard Combo",
      "4K Action Camera",
      "Gaming Mouse RGB",
      "USB-C Docking Station"
    ],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 8990
  },
  {
    category: "Fashion",
    subcategories: ["Men", "Women", "Kids", "Shoes"],
    brands: ["Roadster", "Levis", "H&M", "Puma", "Allen Solly"],
    names: [
      "Solid Cotton Casual Shirt",
      "Slim Fit Denim Jeans",
      "Printed Summer Dress",
      "Kids Graphic T-Shirt",
      "Running Shoes Lite",
      "Formal Leather Belt",
      "Women Sneakers Cloud",
      "Polo Neck T-Shirt",
      "Hooded Sweatshirt",
      "Classic Sports Sandals"
    ],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 1299
  },
  {
    category: "Home & Furniture",
    subcategories: ["Furniture", "Home Decor", "Kitchen Storage", "Bedding"],
    brands: ["Nilkamal", "HomeTown", "Wakefit", "Urban Ladder", "Solimo"],
    names: [
      "Ergo Study Chair",
      "Queen Size Comfort Bed",
      "Wooden Coffee Table",
      "Decorative Wall Shelf",
      "Cotton Bedsheet Set",
      "Kitchen Storage Rack",
      "Floor Lamp Modern",
      "Sofa Cushion Pack",
      "Foldable Shoe Rack",
      "Dining Chair Set"
    ],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 2499
  },
  {
    category: "Appliances",
    subcategories: ["Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves"],
    brands: ["LG", "Samsung", "Whirlpool", "Voltas", "IFB"],
    names: [
      "FrostFree Double Door Refrigerator",
      "Front Load Washing Machine",
      "Inverter Split Air Conditioner",
      "Convection Microwave Oven",
      "Water Purifier Copper",
      "Mixer Grinder Turbo",
      "Induction Cooktop Plus",
      "Room Heater Compact",
      "Electric Kettle Steel",
      "Air Fryer Digital"
    ],
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 3999
  },
  {
    category: "Beauty",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"],
    brands: ["Lakme", "Maybelline", "Mamaearth", "LOreal", "Nivea"],
    names: [
      "Vitamin C Face Serum",
      "Matte Finish Lipstick",
      "Hydrating Face Wash",
      "Argan Hair Oil",
      "Long Stay Kajal",
      "Daily Moisturizer SPF",
      "Floral Eau De Parfum",
      "Aloe Vera Gel",
      "Compact Powder Natural",
      "Keratin Shampoo"
    ],
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 399
  },
  {
    category: "Grocery",
    subcategories: ["Staples", "Snacks", "Beverages", "Personal Care"],
    brands: ["Tata", "Fortune", "Britannia", "Nescafe", "Dabur"],
    names: [
      "Premium Basmati Rice 5kg",
      "Sunflower Cooking Oil 1L",
      "Whole Wheat Atta 10kg",
      "Instant Coffee Jar",
      "Mixed Fruit Juice Pack",
      "Digestive Biscuit Combo",
      "Dry Fruits Gift Box",
      "Herbal Toothpaste",
      "Green Tea Bags",
      "Classic Namkeen Pack"
    ],
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 149
  },
  {
    category: "Sports",
    subcategories: ["Fitness", "Cricket", "Football", "Cycling"],
    brands: ["Nivia", "Cosco", "Yonex", "Adidas", "Strauss"],
    names: [
      "Adjustable Dumbbell Set",
      "English Willow Cricket Bat",
      "Training Football Size 5",
      "Yoga Mat Anti Skid",
      "Badminton Racquet Pro",
      "Cycling Helmet Aero",
      "Skipping Rope Speed",
      "Fitness Resistance Bands",
      "Cricket Leather Ball",
      "Sports Water Bottle"
    ],
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 499
  },
  {
    category: "Books",
    subcategories: ["Fiction", "Non Fiction", "Academic", "Children"],
    brands: ["Penguin", "HarperCollins", "Arihant", "Scholastic", "Rupa"],
    names: [
      "The Mountain Story",
      "Atomic Habits Guide",
      "Modern JavaScript Basics",
      "Children Picture Tales",
      "Indian Polity Handbook",
      "Mystery At Midnight",
      "World History Notes",
      "English Grammar Practice",
      "Business Startup Playbook",
      "Science Activity Book"
    ],
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 299
  },
  {
    category: "Toys",
    subcategories: ["Soft Toys", "Learning Toys", "Action Figures", "Board Games"],
    brands: ["Funskool", "Lego", "Hot Wheels", "Fisher Price", "Hamleys"],
    names: [
      "Soft Teddy Bear Large",
      "Building Blocks Classic",
      "Mini Racing Car Set",
      "Alphabet Learning Board",
      "Superhero Action Figure",
      "Wooden Puzzle Shapes",
      "Family Board Game",
      "Musical Baby Rattle",
      "Remote Control Car",
      "Clay Art Kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"
    ],
    basePrice: 349
  }
];

function buildProducts() {
  return categoryCatalog.flatMap((group) =>
    group.names.map((name, index) => {
      const discountPercentage = [10, 15, 20, 25, 30, 35, 40, 45, 18, 22][index];
      const stockQuantity = index === 9 ? 0 : index % 4 === 0 ? 3 : 8 + index;
      const originalPrice = group.basePrice + index * Math.round(group.basePrice * 0.18);
      const subcategory = group.subcategories[index % group.subcategories.length];
      const brand = group.brands[index % group.brands.length];

      return {
        name,
        brand,
        category: group.category,
        subcategory,
        description: `${name} from ${brand} is a practical ${group.category.toLowerCase()} product for everyday shopping needs.`,
        originalPrice,
        discountPercentage,
        stockQuantity,
        images: group.images,
        rating: Math.round((4 + (index % 7) * 0.1) * 10) / 10,
        numberOfReviews: 120 + index * 87,
        highlights: [
          `Trusted ${brand} quality`,
          `Best suited for ${subcategory}`,
          "Value-for-money pricing",
          "Carefully packed for delivery"
        ],
        specifications: [
          { name: "Brand", value: brand },
          { name: "Category", value: group.category },
          { name: "Subcategory", value: subcategory },
          { name: "Warranty", value: index % 2 === 0 ? "1 Year" : "6 Months" }
        ],
        deliveryInfo: index % 3 === 0 ? "Free delivery in 2-4 days" : "Delivery within 3-6 days",
        returnPolicy: index % 2 === 0 ? "7 days replacement policy" : "10 days return policy",
        sellerName: `${brand} Authorized Seller`,
        featured: index < 2
      };
    })
  );
}

const products = buildProducts();

async function seed() {
  try {
    await connectDb();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true
    });

    await Product.insertMany(products);

    console.log("Seed data added");
    console.log("Admin email: admin@example.com");
    console.log("Admin password: password123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
