import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { createCheckout } from "../../services/orderService.js";
import { formatMoney } from "../../utils/formatMoney.js";

export default function Checkout() {
  usePageTitle("Checkout");

  const { cartItems, cartTotal } = useCart();
  const hasOutOfStockItem = cartItems.some((item) => (item.stockQuantity ?? item.countInStock) === 0);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (hasOutOfStockItem) {
      setError("Remove out-of-stock products before checkout.");
      return;
    }

    setLoading(true);

    try {
      const data = await createCheckout({
        items: cartItems,
        shippingAddress: form
      });

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed.");
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="rounded-md border border-neutral-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold">Cart is empty</h1>
        <p className="mt-2 text-neutral-600">You need products before checkout.</p>
        <Link to="/products" className="mt-5 inline-block">
          <Button>Browse products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-neutral-200 bg-white p-5 shadow-soft">
          <ErrorMessage message={error} />
          <Input id="fullName" label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <Input id="address" label="Address" name="address" value={form.address} onChange={handleChange} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="city" label="City" name="city" value={form.city} onChange={handleChange} required />
            <Input id="postalCode" label="Postal code" name="postalCode" value={form.postalCode} onChange={handleChange} required />
          </div>
          <Input id="country" label="Country" name="country" value={form.country} onChange={handleChange} required />
          <Button type="submit" disabled={loading}>
            {loading ? "Opening Stripe..." : "Pay with Stripe test mode"}
          </Button>
        </form>

        <aside className="h-fit rounded-md border border-neutral-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.product} className="flex justify-between gap-4 text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatMoney(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
            <span>Total</span>
            <strong>{formatMoney(cartTotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
