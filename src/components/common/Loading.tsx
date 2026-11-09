// Displays the supplied loading text or the default message.
export default function Loading({ text = 'Loading...' }: { text?: string }) {
  return <p className="loading">{text}</p>
}