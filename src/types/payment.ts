// Describes the client secret returned for a payment intent.

 type PaymentStatus  = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'
export interface PaymentIntentResponse {
  paymentId : number
  clientSecret: string
  amount : number
  currency : string
}

export interface PaymentResponse{
  id : number
  orderId :number
  amount : number
  currency : string
  ststus : PaymentStatus
  failureReason? : string | null
  createdOn : string
}