import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gold-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-neutral-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Nilgit Store is a learning project. Use test payment keys only.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-gold-700" to="/about">About</Link>
          <Link className="hover:text-gold-700" to="/contact">Contact</Link>
          <Link className="hover:text-gold-700" to="/privacy">Privacy</Link>
          <Link className="hover:text-gold-700" to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
