export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-48 items-center justify-center p-6 text-sm text-neutral-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-100 border-t-gold-600" />
      <span className="ml-3">{label}</span>
    </div>
  );
}
