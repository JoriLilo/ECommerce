interface QuantityInputProps {
  value: number
  max?: number
  onChange: (value: number) => void
}

export default function QuantityInput({ value, max, onChange }: QuantityInputProps) {
  return (
    <div className="quantity">
      <button onClick={() => onChange(value - 1)} disabled={value <= 1}>-</button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={max !== undefined && value >= max}>+</button>
    </div>
  )
}