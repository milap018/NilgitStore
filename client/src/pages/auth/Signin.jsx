import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Signin() {
  usePageTitle("Signin");

  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin(form);
      navigate(location.state?.from || "/products");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-md border border-neutral-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-neutral-600">Use the seeded admin account or create a new customer account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ErrorMessage message={error} />
        <Input id="email" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Signin"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-600">
        New here?{" "}
        <Link className="font-semibold text-ink" to="/signup">
          Signup
        </Link>
      </p>
    </section>
  );
}
