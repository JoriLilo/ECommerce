export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="form-error">{message}</p>
}