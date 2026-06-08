export default function Input({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <input
        id={id}
        className="w-full rounded-md border border-gold-200 bg-white px-3 py-2 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        {...props}
      />
    </label>
  );
}
