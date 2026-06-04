import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Terms() {
  usePageTitle("Terms");

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-clay">Terms & Conditions</p>
        <h1 className="mt-2 text-4xl font-bold">Simple terms for using this learning store</h1>
        <p className="mt-3 text-neutral-600">
          Nilgit Store is a practice project, not a real commercial marketplace.
        </p>
      </div>

      <div className="space-y-5 rounded-md border border-neutral-200 bg-white p-6 shadow-soft">
        <article>
          <h2 className="text-xl font-bold">Demo products</h2>
          <p className="mt-2 text-neutral-600">
            Product names, prices, sellers, delivery details, and return policies are sample data for learning.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">Test payments</h2>
          <p className="mt-2 text-neutral-600">
            Payments should use Stripe test mode only. Do not use real payment keys in this project.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">Admin access</h2>
          <p className="mt-2 text-neutral-600">
            Admin routes are for product management practice and should be protected carefully before real deployment.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">No real orders</h2>
          <p className="mt-2 text-neutral-600">
            Orders created in this app are demo records unless you intentionally connect production services.
          </p>
        </article>
      </div>
    </section>
  );
}
