export type ProductDTO = {
  id: string
  name: string
  description: string
  isNew: boolean
  price: number
  acceptTrade: boolean
  userId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  paymentMethods: string[]
}
// How send to backend
// id: string
// name: string
// description: string
// is_new: boolean
// price: number
// accept_trade: boolean
// user_id: string
// is_active: boolean
// created_at: string
// updated_at: string
// payment_methods: 'pix' | 'card' | 'deposit' | 'cash' | 'boleto'
