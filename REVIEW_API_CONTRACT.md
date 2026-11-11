# Reviews: frontend integration contract

The frontend is implemented; the backend endpoints below are proposed, not yet verified.
Adjust src/services/reviewService.ts and src/types/review.ts to match the final backend DTOs.

## List
GET /api/products/{productId}/reviews?page=0&size=50&sort=createdOn,desc
Public. Return { content: ProductReview[], totalPages: number }.
An unpaginated array is also accepted. No reviews: empty content with totalPages 0 or 1.
ProductReview: { id: number, productId: number, userId: number, userName: string,
 rating: integer 1..5, comment: string, createdOn: ISO date string }.
No user emails or token information should appear in public responses.
The frontend reads all pages to detect whether the signed-in user already reviewed this product.
For larger datasets, add a separate current-user-review endpoint to avoid loading every review.

## Create
POST /api/products/{productId}/reviews
Authenticated. Body: { rating: integer 1..5, comment: string (trimmed, 1..2000 characters) }.
Return the saved ProductReview as JSON. The frontend reloads the list after success.
Derive the user id from authentication, never from client-supplied identity.
Reject duplicates with HTTP 409 and a readable message such as
"You have already reviewed this product."
Enforce a database unique constraint on (user_id, product_id), including concurrent submissions.
A user can review many DIFFERENT products. No purchase-verification or seller-ownership restriction
has been assumed; agree those rules separately if desired.

## Behavior while backend is pending
The reviews section shows a load error and retry action. It does not invent reviews or store
reviews locally. Product details and add-to-cart continue independently.
The new-review form appears only after reviews load successfully, for signed-in users without
an existing review. Submission buttons are locked while posting. Backend uniqueness remains essential.
