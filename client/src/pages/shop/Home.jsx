import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Home() {
  usePageTitle("Home");

  return (
    <section className="grid items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-normal text-clay">Full-stack learning shop</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Build, test, and understand a real e-commerce flow.
        </h1>
        <p className="max-w-2xl text-lg text-neutral-600">
          Browse products, manage a cart, checkout with Stripe test mode, and learn how React talks to Express,
          MongoDB, cookies, Cloudinary, and protected admin routes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products">
            <Button>Shop products</Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-soft">
        <img
          className="h-[360px] w-full object-cover"
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
          alt="Products on a clean desk"
        />
      </div>
    </section>
  );
}
