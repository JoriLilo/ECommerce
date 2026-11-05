interface SubmitButtonProps {
  loading: boolean
  text: string
  loadingText: string
}

export default function SubmitButton({ loading, text, loadingText }: SubmitButtonProps) {
  return (
    <button type="submit" disabled={loading} className="btn-primary">
      {loading ? loadingText : text}
    </button>
  )
}