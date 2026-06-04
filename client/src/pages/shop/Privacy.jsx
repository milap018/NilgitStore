import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Privacy() {
  usePageTitle("Privacy Policy");

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-clay">Privacy Policy</p>
        <h1 className="mt-2 text-4xl font-bold">How Nilgit Store handles learning project data</h1>
        <p className="mt-3 text-neutral-600">
          This project is built for practice. Use test keys and avoid entering sensitive real customer data.
        </p>
      </div>

      <div className="space-y-5 rounded-md border border-neutral-200 bg-white p-6 shadow-soft">
        <article>
          <h2 className="text-xl font-bold">Information collected</h2>
          <p className="mt-2 text-neutral-600">
            The app stores account details, cart items, shipping address data, products, and orders needed for the demo store flow.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">Authentication cookies</h2>
          <p className="mt-2 text-neutral-600">
            JWT tokens are stored in httpOnly cookies so frontend JavaScript cannot directly read the token.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">Payments and uploads</h2>
          <p className="mt-2 text-neutral-600">
            Stripe should use test mode only, and Cloudinary image URLs are stored with product records.
          </p>
        </article>
        <article>
          <h2 className="text-xl font-bold">Learning reminder</h2>
          <p className="mt-2 text-neutral-600">
            Before using this project for real users, add production-grade validation, logging, policies, and legal review.
          </p>
        </article>
      </div>
    </section>
  );
}
