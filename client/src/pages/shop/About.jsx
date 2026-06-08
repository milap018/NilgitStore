import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function About() {
  usePageTitle("About Us");

  return (
    <section className="space-y-8">
      <div className="rounded-md border border-gold-200 bg-gradient-to-br from-white via-gold-50 to-gold-200 px-6 py-12 text-ink shadow-soft sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-normal text-gold-700">About Nilgit Store</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          A learning-first e-commerce store built like a real shopping app.
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-700">
          Nilgit Store is a full-stack project for understanding how products, carts, authentication,
          orders, admin tools, payments, images, and database data work together.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Beginner friendly</h2>
          <p className="mt-2 text-sm text-neutral-600">
            The code uses clear folders, simple state management, and readable backend controllers.
          </p>
        </article>
        <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Real store flow</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Products, carts, checkout, orders, stock, admin actions, and protected routes are all connected.
          </p>
        </article>
        <article className="rounded-md border border-gold-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Practice ready</h2>
          <p className="mt-2 text-sm text-neutral-600">
            You can add features, debug errors, deploy changes, and keep improving the project.
          </p>
        </article>
      </div>

      <div className="rounded-md border border-gold-100 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold">What this project teaches</h2>
        <div className="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
          <p>React pages, components, routes, hooks, and Context API.</p>
          <p>Express routes, controllers, middleware, and protected APIs.</p>
          <p>MongoDB product, user, and order models with Mongoose.</p>
          <p>JWT cookies, admin checks, Stripe test checkout, and Cloudinary image uploads.</p>
        </div>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Explore products</Button>
        </Link>
      </div>
    </section>
  );
}
