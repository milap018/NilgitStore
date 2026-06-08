import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold-50/80 to-transparent" />
        <div className="relative">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
