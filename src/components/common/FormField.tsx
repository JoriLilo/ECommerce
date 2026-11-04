interface FormFieldProps {
  label: string
  type?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function FormField({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
        className="form-input"
      />
    </div>
  )
}