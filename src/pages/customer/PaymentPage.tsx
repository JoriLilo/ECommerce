import { Link ,useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrder } from '../../services/orderService'
import type { Order } from '../../types/order'
import type { PaymentIntentResponse } from '../../types/payment'
import { paymentProcessing } from '../../services/paymentService'
import ErrorMessage from '../../components/common/ErrorMessage'

import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '../../utils/stripeConfig'
import PaymentForm from '../../features/payment/PaymentForm'



export default function PaymentPage() {

    const { orderId } = useParams()
    const id = Number(orderId)
    const [order, setOrder] = useState<Order | null>(null)
    const [payment, setPayment] = useState<PaymentIntentResponse | null>(null) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect (() =>{

        let cancelled = false;
        async function load() {
            setLoading(true)
            setOrder(null)
            setPayment(null)
            setError(null)

            try {
                if (!Number.isInteger(id) || id < 1){
                    throw new Error('Invalid order ID.')
                }

            
              
                    const loadedOrder  : Order = await getOrder(id)

                if (!cancelled) {
                    setOrder( loadedOrder)

                    if(loadedOrder.status ===  'PENDING_PAYMENT'){
                        const response  : PaymentIntentResponse = await paymentProcessing({ orderId : id })
                        if (!cancelled){
                            setPayment(response)
                        }
                    }
                }
                    

            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Could not load order.')
                }
            } finally {

                if (!cancelled) setLoading(false)
            }
        
        }

        load()
        function cleanup() {
            cancelled = true
        }

        return cleanup
        
    }, [id])

    if (loading) {
        return <p role="status">Preparing payment…</p>
    }

    if (error) {
        return <ErrorMessage message={error} />
    }

    if (!order) {
        return <p>Order not found.</p>
    }

    if (order.status !== 'PENDING_PAYMENT') {
        return (
            <section className="content-page">
                <h1>Order #{order.id}</h1>
                <p>Order status: {order.status}</p>
                <Link to={`/orders/${order.id}`}>View order</Link>
            </section>
        )
    }

    if (!payment) {
        return <p>Payment information is unavailable.</p>
    }

    return (
    <section className="content-page">
        <h1>Pay for order #{order.id}</h1>
        <p>
        Total:{' '}
        {new Intl.NumberFormat('sq-AL', {
            style: 'currency',
            currency: payment.currency,
        }).format(payment.amount)}
        </p>
        <Elements
            stripe={stripePromise}
            options={{ clientSecret: payment.clientSecret }}
            >
          <PaymentForm orderId={order.id} />
        </Elements>
    </section>
    )



    
    }