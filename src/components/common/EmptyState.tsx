// Displays a message when there are no entries to show.
export default function EmptyState({ message }: { message: string }) {
  return <p className="empty-state">{message}</p>
}