// the items the cart will hold
//one product entry in the cart
export interface CartItem {
  id: number
  productId: number
  productName: string
  //price for one product
  unitPrice: number
  quantity: number
  //the total price for the products quantity
  lineTotal: number
  availableStock: number
}
// Describes the cart items and  totals.
export interface Cart {
  items: CartItem[]
  // Total number of units across all cart entries.
  totalItems: number
  totalAmount: number
}
