import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

function clampQuantity(value, min, max) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return min;
  }

  return Math.max(min, Math.min(Math.floor(numberValue), max));
}

export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  label = "Quantity",
  className = ""
}) {
  const safeMax = Math.max(min, Number(max) || min);
  const safeValue = clampQuantity(value, min, safeMax);
  const [draftValue, setDraftValue] = useState(String(safeValue));
  const isDisabled = disabled || safeMax < min;

  useEffect(() => {
    setDraftValue(String(safeValue));
  }, [safeValue]);

  function updateQuantity(nextValue) {
    const nextQuantity = clampQuantity(nextValue, min, safeMax);
    setDraftValue(String(nextQuantity));
    onChange(nextQuantity);
  }

  function handleInputChange(event) {
    const nextValue = event.target.value.replace(/\D/g, "");

    if (nextValue === "") {
      setDraftValue("");
      return;
    }

    updateQuantity(nextValue);
  }

  function handleInputBlur() {
    if (draftValue === "") {
      updateQuantity(min);
    }
  }

  return (
    <div className={className}>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="inline-flex overflow-hidden rounded-md border border-gold-300 bg-white shadow-sm focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-100">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center border-r border-gold-200 bg-gold-50 text-ink transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
          onClick={() => updateQuantity(safeValue - 1)}
          disabled={isDisabled || safeValue <= min}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        <input
          className="quantity-input h-9 w-12 border-0 bg-white px-1 text-center text-sm font-semibold text-ink outline-none"
          type="number"
          min={min}
          max={safeMax}
          inputMode="numeric"
          value={draftValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isDisabled}
          aria-label={label}
        />

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center border-l border-gold-200 bg-gold-500 text-ink transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
          onClick={() => updateQuantity(safeValue + 1)}
          disabled={isDisabled || safeValue >= safeMax}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
