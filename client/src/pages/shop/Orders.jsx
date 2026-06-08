import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Loader from "../../components/common/Loader.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";
import { getMyOrders } from "../../services/orderService.js";
import { formatMoney } from "../../utils/formatMoney.js";

export default function Orders() {
  usePageTitle("Orders");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return <Loader label="Loading orders..." />;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">My orders</h1>
      <div className="mt-6">
        <ErrorMessage message={error} />
        {orders.length === 0 ? (
          <p className="rounded-md border border-gold-100 bg-white p-6 text-neutral-600">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h2 className="font-semibold">Order {order._id}</h2>
                    <p className="text-sm text-neutral-600">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-sm">
                    <span className={order.isPaid ? "font-semibold text-gold-700" : "font-semibold text-gold-600"}>
                      {order.isPaid ? "Paid" : "Not paid"}
                    </span>
                    <span className="ml-4 font-semibold">{formatMoney(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item.product}`} className="flex justify-between gap-4 text-sm text-neutral-600">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatMoney(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
