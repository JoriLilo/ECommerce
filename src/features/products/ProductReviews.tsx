import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../../utils/auth'
import { createProductReview, getProductReviews } from '../../services/reviewService'
import type { ProductReview } from '../../types/review'
import './ProductReviews.css'

// One instance per product. The backend remains responsible for enforcing uniqueness.
export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const mounted = useRef(false)
  const submitting = useRef(false)
  const user = getUser()

  useEffect(function trackMount() {
    mounted.current = true
    return function cleanup() { mounted.current = false }
  }, [])

  useEffect(function loadReviewEffect() {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const data = await getProductReviews(productId)
        if (!cancelled) setReviews(data)
      } catch {
        if (!cancelled) setLoadError('Reviews could not be loaded. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return function cleanup() { cancelled = true }
  }, [productId, refreshCount])

  let myReview: ProductReview | undefined
  let ratingTotal = 0
  const entries = []
  for (const review of reviews) {
    ratingTotal += review.rating
    if (review.userId === user?.id) myReview = review
    const date = new Date(review.createdOn)
    entries.push(
      <article className="review-entry" key={review.id}>
        <div className="review-entry-heading">
          <strong>{review.userName || 'Shopper'}{review.userId === user?.id ? ' (you)' : ''}</strong>
          {!Number.isNaN(date.getTime()) && <time dateTime={review.createdOn}>{date.toLocaleDateString()}</time>}
        </div>
        <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
          <span aria-hidden="true">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
        </p>
        <p className="review-comment">{review.comment}</p>
      </article>,
    )
  }

  function handleRating(event: ChangeEvent<HTMLSelectElement>) { setRating(event.target.value) }
  function handleComment(event: ChangeEvent<HTMLTextAreaElement>) { setComment(event.target.value) }
  function incrementRefresh(count: number) { return count + 1 }
  function handleRefresh() { setRefreshCount(incrementRefresh) }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || myReview || submitted || loading || loadError) return
    if (!getUser()) {
      setSaveError('Please sign in before posting a review.')
      return
    }
    const score = Number(rating)
    if (!Number.isInteger(score) || score < 1 || score > 5 || !comment.trim() || comment.trim().length > 2000) {
      setSaveError('Choose a rating and enter a review of 1–2,000 characters.')
      return
    }
    submitting.current = true
    setSaving(true)
    setSaveError(null)
    try {
      await createProductReview(productId, { rating: score, comment: comment.trim() })
      if (mounted.current) {
        setSubmitted(true)
        setComment('')
        setRefreshCount(incrementRefresh)
      }
    } catch (err) {
      if (mounted.current) {
        setSaveError(err instanceof Error ? err.message : 'Could not submit your review. Please try again.')
        // Recheck existing reviews if another tab submitted first or the response was lost.
        setRefreshCount(incrementRefresh)
      }
    } finally {
      submitting.current = false
      if (mounted.current) setSaving(false)
    }
  }

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-title">
      <header className="reviews-heading">
        <div><p className="reviews-eyebrow">FROM THE COMMUNITY</p><h2 id="product-reviews-title">Product reviews</h2></div>
        {!loading && !loadError && reviews.length > 0 && (
          <p className="reviews-average"><strong>{(ratingTotal / reviews.length).toFixed(1)}</strong> / 5 <span>· {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span></p>
        )}
      </header>
      {loading && <p role="status">Loading reviews…</p>}
      {loadError && <div className="reviews-notice" role="alert"><p>{loadError}</p><button type="button" onClick={handleRefresh}>Try again</button></div>}
      {submitted && <p className="reviews-notice" role="status">Thank you! Your review has been submitted.</p>}
      {!loading && !loadError && (
        <div className="reviews-layout">
          <div className="reviews-list">{entries.length ? entries : <p className="reviews-empty">No reviews yet. Share your experience with this product.</p>}</div>
          <div className="review-compose">
            {!user ? <><h3>Share your experience</h3><p><Link to="/login">Sign in</Link> to review this product.</p></>
              : myReview || submitted ? <><h3>You’ve reviewed this product</h3><p>One review per product keeps feedback fair. You can review other products too.</p></>
              : <form onSubmit={handleSubmit}>
                <h3>Write a review</h3><p>One review per account for this product.</p>
                <fieldset disabled={saving}>
                  <label htmlFor="review-rating">Your rating</label>
                  <select id="review-rating" value={rating} onChange={handleRating} required>
                    <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Average</option><option value="2">2 — Poor</option><option value="1">1 — Very poor</option>
                  </select>
                  <label htmlFor="review-comment">Your review</label>
                  <textarea id="review-comment" value={comment} onChange={handleComment} rows={5} maxLength={2000} required placeholder="What did you like? What could be better?" />
                  <p className="review-counter">{comment.length}/2,000</p>
                  <button type="submit">{saving ? 'Submitting…' : 'Submit review'}</button>
                </fieldset>
              </form>}
            {saveError && <p className="form-error" role="alert">{saveError}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
