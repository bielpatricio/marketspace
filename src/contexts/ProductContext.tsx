import { ProductDTO } from '@dtos/ProductDTO'
import { api } from '@services/axios'
import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

type ProductContextDataProps = {
  product: ProductDTO
  getAllProductRegistered: () => Promise<void>
  isLoadingUserStorageData: boolean
}

export const ProductContext = createContext({} as ProductContextDataProps)

interface ProductProviderProps {
  children: ReactNode
}

export function ProductContextProvider({ children }: ProductProviderProps) {
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  const getAllProductRegistered = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      console.log(
        'response error api.defaults.headers.common.Authorization',
        api.defaults.headers.common.Authorization,
      )
      const response = await api.get('/products', {
        params: {
          is_new: true,
          accept_trade: true,
          // payment_methods: 'pix',
          // query: 'Cadeira',
        },
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      })
      console.log('response meeee', response.data)
      // eslint-disable-next-line
    } catch (error) {
      console.log('response error', error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  useEffect(() => {
    getAllProductRegistered()
  }, [getAllProductRegistered])

  return (
    <ProductContext.Provider
      value={{
        product,
        getAllProductRegistered,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
