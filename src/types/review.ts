// Public review response. The backend obtains user identity from authentication.
export interface ProductReview {
  id: number
  productId: number
  userFullName: string
  rating: number
  comment: string
  createdOn: string
}

export interface ReviewInput {
  rating: number
  comment: string
}

export interface ReviewPage {
  content: ProductReview[]
  totalPages: number
}
