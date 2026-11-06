export interface CartItem {
  id: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
  availableStock: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}
