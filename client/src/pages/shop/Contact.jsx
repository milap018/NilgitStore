import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.jsx";

export default function Contact() {
  usePageTitle("Contact Us");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-gold-700">Contact Us</p>
          <h1 className="mt-2 text-4xl font-bold">Need help with your order or learning flow?</h1>
          <p className="mt-3 text-neutral-600">
            Send a message, ask about products, or use this page to practice form handling in React.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 rounded-md border border-gold-100 bg-white p-4 shadow-soft">
            <Mail className="text-gold-700" />
            <div>
              <h2 className="font-semibold">Email</h2>
              <p className="text-sm text-neutral-600">support@nilgitstore.test</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-md border border-gold-100 bg-white p-4 shadow-soft">
            <Phone className="text-gold-700" />
            <div>
              <h2 className="font-semibold">Phone</h2>
              <p className="text-sm text-neutral-600">+91 90000 00000</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-md border border-gold-100 bg-white p-4 shadow-soft">
            <MapPin className="text-gold-700" />
            <div>
              <h2 className="font-semibold">Location</h2>
              <p className="text-sm text-neutral-600">Learning project workspace, India</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-gold-100 bg-white p-6 shadow-soft">
        {sent && (
          <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Message received locally. Connect an email API later to send real messages.
          </p>
        )}
        <Input id="name" label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input id="email" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">Message</span>
          <textarea
            className="min-h-36 w-full rounded-md border border-gold-200 px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>
        <Button type="submit">Send message</Button>
      </form>
    </section>
  );
}
