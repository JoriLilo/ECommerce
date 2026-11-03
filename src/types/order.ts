export type OrderStatus = 'PENDING_PAYMENT' |'PROCESSING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED'

export interface OrderItem {
    id: number
    orderId: number
    productId: number
    quantity: number
    price: number
    createdAt: string
    updatedAt: string
}




export interface SellerOrder{
    id: number
    sellerId: number
    storeName: string
    orderItems: OrderItem[]
    totalPrice: number
    createdAt: string
    updatedAt: string
}

export interface Order {
    id: number
    userId: number
    orderItems: OrderItem[]
    totalPrice: number
    status: OrderStatus
    createdAt: string
    updatedAt: string
    sellerOrders: SellerOrder[]
}