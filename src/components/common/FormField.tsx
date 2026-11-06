import { useId, useState } from 'react'

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
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={isPassword ? 'password-field' : undefined}>
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          step={type === 'number' ? 'any' : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required
          className="form-input"
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            aria-controls={id}
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {showPassword && <path d="m3 3 18 18" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}