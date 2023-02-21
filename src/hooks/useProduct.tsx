import { ProductContext } from '@contexts/ProductContext'
import { useContext } from 'react'

export function useProduct() {
  const context = useContext(ProductContext)

  return context
}
