export default function Input({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <input
        id={id}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none transition focus:border-ink focus:ring-2 focus:ring-skysoft"
        {...props}
      />
    </label>
  );
}
