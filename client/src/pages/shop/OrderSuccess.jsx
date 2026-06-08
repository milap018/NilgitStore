import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { verifyPayment } from "../../services/orderService.js";

export default function OrderSuccess() {
  usePageTitle("Order Success");

  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("Missing Stripe session id.");
        setStatus("error");
        return;
      }

      try {
        await verifyPayment(sessionId);
        clearCart();
        setStatus("success");
      } catch (err) {
        setError(err.response?.data?.message || "Payment verification failed.");
        setStatus("error");
      }
    }

    verify();
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return <Loader label="Verifying payment..." />;
  }

  if (status === "error") {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="rounded-md border border-gold-100 bg-white p-8 text-center shadow-soft">
      <h1 className="text-3xl font-bold">Order paid successfully</h1>
      <p className="mt-2 text-neutral-600">Stripe test payment was verified by the backend.</p>
      <Link to="/orders" className="mt-5 inline-block">
        <Button>View orders</Button>
      </Link>
    </section>
  );
}
