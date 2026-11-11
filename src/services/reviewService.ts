import { apiGet, apiPost } from './api'
import type { ProductReview, ReviewInput, ReviewPage } from '../types/review'

// Collect all pages of public or current-user reviews using the backend response shape.
async function loadReviews(path: string): Promise<ProductReview[]> {
  const reviews = new Map<number, ProductReview>()
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<ReviewPage | ProductReview[]>(
      `${path}?page=${page}&size=50&sort=createdOn,desc`,
    )
    const entries = Array.isArray(result) ? result : result?.content
    if (!Array.isArray(entries)) throw new Error('The review service returned an unexpected response.')
    for (const review of entries) {
      if (typeof review.id !== 'number' || typeof review.userFullName !== 'string' ||
        typeof review.productId !== 'number' || !Number.isInteger(review.rating) ||
        review.rating < 1 || review.rating > 5 || typeof review.comment !== 'string') {
        throw new Error('The review service returned an unexpected response.')
      }
      reviews.set(review.id, review)
    }
    if (Array.isArray(result)) totalPages = 1
    else {
      if (!Number.isInteger(result.totalPages) || result.totalPages < 0) {
        throw new Error('The review service returned invalid pagination.')
      }
      totalPages = result.totalPages
    }
    page++
  }
  return [...reviews.values()]
}

export function getProductReviews(productId: number): Promise<ProductReview[]> {
  return loadReviews(`/products/${productId}/reviews`)
}

// Ownership comes from the authenticated endpoint, never a display-name comparison.
export async function getMyProductReview(productId: number): Promise<ProductReview | null> {
  const reviews = await loadReviews('/reviews/mine')
  for (const review of reviews) {
    if (review.productId === productId) return review
  }
  return null
}

// Never send userId: the backend must use the authenticated account.
export function createProductReview(productId: number, input: ReviewInput) {
  return apiPost<ProductReview>(`/products/${productId}/reviews`, {
    rating: input.rating,
    comment: input.comment.trim(),
  })
}
