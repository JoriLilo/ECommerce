// Describes the values and callbacks accepted by this component.
interface SubmitButtonProps {
  loading: boolean
  text: string
  loadingText: string
}

// Disables submission and changes the label while saving.
export default function SubmitButton({ loading, text, loadingText }: SubmitButtonProps) {
  return (
    <button type="submit" disabled={loading} className="btn-primary">
      {loading ? loadingText : text}
    </button>
  )
}