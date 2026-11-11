
import type { PaymentIntentResponse, PaymentResponse } from "../types/payment";


import { apiGet, apiPost } from "./api";
export async function paymentProcessing( {orderId} : {orderId: number} ): Promise<PaymentIntentResponse>
 {
  const response: PaymentIntentResponse = await apiPost<PaymentIntentResponse>("/payments/intent", {orderId: orderId});

  return response;
}

export async function getPayment (paymentId : number ) : Promise<PaymentResponse> {

    const response : PaymentResponse  = await apiGet<PaymentResponse>(`/payments/${paymentId}`)

    return response

}