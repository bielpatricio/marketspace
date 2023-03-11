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
  allProductsPublicated: ProductDTO[]
  productCreatedAndReadyToPost: ProductDTO
  getAllProductRegistered: () => Promise<void>
  isLoadingUserStorageData: boolean
  handleCreateNewPost: (data: ProductDTO, img: any) => void
  imageOfProductCreatedAndReadyToPost: any[]
}

export const ProductContext = createContext({} as ProductContextDataProps)

interface ProductProviderProps {
  children: ReactNode
}

export function ProductContextProvider({ children }: ProductProviderProps) {
  const [allProductsPublicated, setAllProductsPublicated] = useState<
    ProductDTO[]
  >([])

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
      console.log('setAllProductsPublicated', response.data)
      setAllProductsPublicated(response.data)
      // eslint-disable-next-line
    } catch (error) {
      console.log('response error', error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  const [productCreatedAndReadyToPost, setProductCreatedAndReadyToPost] =
    useState<ProductDTO>({} as ProductDTO)
  const [
    imageOfProductCreatedAndReadyToPost,
    setImageOfProductCreatedAndReadyToPost,
  ] = useState<any[]>([])

  function handleCreateNewPost(data: ProductDTO, img: any[]) {
    // eslint-disable-next-line
    const {
      id,
      name,
      description,
      isNew,
      price,
      acceptTrade,
      userId,
      isActive,
      createdAt,
      updatedAt,
      paymentMethods,
    } = data
    setProductCreatedAndReadyToPost({
      id,
      name,
      description,
      isNew,
      price,
      acceptTrade,
      userId,
      isActive,
      createdAt,
      updatedAt,
      paymentMethods,
    })
    setImageOfProductCreatedAndReadyToPost(img)

    console.log('productCreatedAndReadyToPost', productCreatedAndReadyToPost)
  }

  useEffect(() => {
    getAllProductRegistered()
  }, [getAllProductRegistered])

  return (
    <ProductContext.Provider
      value={{
        imageOfProductCreatedAndReadyToPost,
        handleCreateNewPost,
        allProductsPublicated,
        productCreatedAndReadyToPost,
        getAllProductRegistered,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
