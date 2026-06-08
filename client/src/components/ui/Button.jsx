export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = {
    primary:
      "border border-gold-600 bg-gold-500 text-ink shadow-[0_10px_22px_rgba(217,154,0,0.22)] hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-400 hover:shadow-[0_14px_28px_rgba(217,154,0,0.28)] active:translate-y-0 active:scale-[0.98]",
    secondary:
      "border border-gold-300 bg-white text-ink hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-50 active:translate-y-0 active:scale-[0.98]",
    danger: "border border-red-700 bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:translate-y-0 disabled:scale-100 disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:shadow-none ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
