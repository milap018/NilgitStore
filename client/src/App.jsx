import { Navigate, Route, Routes } from "react-router-dom";
import PageShell from "./components/layout/PageShell.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Signup from "./pages/auth/Signup.jsx";
import About from "./pages/shop/About.jsx";
import Cart from "./pages/shop/Cart.jsx";
import Contact from "./pages/shop/Contact.jsx";
import Checkout from "./pages/shop/Checkout.jsx";
import Home from "./pages/shop/Home.jsx";
import OrderSuccess from "./pages/shop/OrderSuccess.jsx";
import Privacy from "./pages/shop/Privacy.jsx";
import Profile from "./pages/shop/Profile.jsx";
import ProductDetails from "./pages/shop/ProductDetails.jsx";
import Products from "./pages/shop/Products.jsx";
import Terms from "./pages/shop/Terms.jsx";
import Wishlist from "./pages/shop/Wishlist.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function NotFound() {
  return (
    <section className="rounded-md border border-gold-100 bg-white p-8 text-center shadow-soft">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-600">Check the route in the address bar.</p>
    </section>
  );
}

export default function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Navigate to="/profile?tab=orders" replace />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/:id/edit" element={<EditProduct />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageShell>
  );
}
