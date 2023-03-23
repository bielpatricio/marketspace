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
  handleConfirmCreateNewPost: () => void
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
        'api.defaults.headers.common.Authorization',
        api.defaults.headers.common.Authorization,
      )
      const response = await api.get('/products', {
        params: {
          //   is_new: true,
          //   accept_trade: true,
          //   payment_methods: 'pix',
          //   query: 'Cadeira',
        },
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      })
      console.log('setAllProductsPublicated', response.data)
      setAllProductsPublicated(response.data)
      // eslint-disable-next-line
    } catch (error) {
      console.log('response error ProductContextProvider', error)
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

  // useEffect(() => {
  //   getAllProductRegistered()
  // }, [getAllProductRegistered])

  async function handleConfirmCreateNewPost() {
    // eslint-disable-next-line
    const {name, description, isNew, price, acceptTrade, paymentMethods} = productCreatedAndReadyToPost

    console.log('productCreatedAndReadyToPost', productCreatedAndReadyToPost)
    try {
      const response = await api.post('/products', {
        name,
        description,
        is_new: isNew,
        price,
        accept_trade: acceptTrade,
        payment_methods: paymentMethods,
      })
      console.log('setAllProductsPublicated', response.data)
      try {
        const responseImage = await api.post(
          '/products/images',
          imageOfProductCreatedAndReadyToPost,
        )
        console.log('images', responseImage.data)
      } catch (errorImage) {
        console.log('response error errorImage', errorImage)
        throw errorImage
      }
    } catch (error) {
      console.log('response error ProductContextProvider', error)
      throw error
    }
  }

  return (
    <ProductContext.Provider
      value={{
        imageOfProductCreatedAndReadyToPost,
        handleCreateNewPost,
        allProductsPublicated,
        productCreatedAndReadyToPost,
        getAllProductRegistered,
        isLoadingUserStorageData,
        handleConfirmCreateNewPost,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
