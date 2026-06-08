import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Signup() {
  usePageTitle("Signup");

  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await signup(form);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-md border border-gold-100 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-neutral-600">Signup saves your session in a secure httpOnly cookie.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ErrorMessage message={error} />
        <Input id="name" label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input id="email" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link className="font-semibold text-gold-700" to="/signin">
          Signin
        </Link>
      </p>
    </section>
  );
}
