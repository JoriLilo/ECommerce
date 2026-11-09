import { Link } from 'react-router-dom'

// Shows a fallback page for an unknown route.
export default function NotFoundPage() {
  return (
    <section className="content-page">
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  )
}
