// Describes a saved delivery address and its default-address flag.
export interface Address {
  id: number
  phone: string
  street: string
  city: string
  country: string
  postalCode: string
  defaultAddress: boolean
}