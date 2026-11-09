// Displays a status label with a class based on its lowercase value.
export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {status.replace('_', ' ')}
    </span>
  )
}