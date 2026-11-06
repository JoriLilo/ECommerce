interface QuantityInputProps {
  value: number
  max?: number
  onChange: (value: number) => void
}

export default function QuantityInput({ value, max, onChange }: QuantityInputProps) {
  return (
    <div className="quantity" role="group" aria-label="Quantity">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
      >
        +
      </button>
    </div>
  )
}