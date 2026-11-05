export default function Loading({ text = 'Loading...' }: { text?: string }) {
  return <p className="loading">{text}</p>
}