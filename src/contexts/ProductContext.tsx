import { ProductDTO } from '@dtos/ProductDTO'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import { api } from '@services/axios'
import { useNavigation } from '@react-navigation/native'
import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

type ProductContextDataProps = {
  allProductsPublicated: ProductDTO[]
  myProductsPublicated: ProductDTO[]
  productCreatedAndReadyToPost: ProductDTO
  getAllProductRegistered: () => Promise<void>
  getMyProductRegistered: () => Promise<void>
  isLoadingUserStorageData: boolean
  handleCreateNewPost: (data: ProductDTO, img: any) => void
  handleConfirmCreateNewPost: () => void
  imageOfProductCreatedAndReadyToPost: any[]
  getProductById: (id: string) => Promise<ProductDTO>
}

export const ProductContext = createContext({} as ProductContextDataProps)

interface ProductProviderProps {
  children: ReactNode
}

export function ProductContextProvider({ children }: ProductProviderProps) {
  const [allProductsPublicated, setAllProductsPublicated] = useState<
    ProductDTO[]
  >([])

  const [myProductsPublicated, setMyProductsPublicated] = useState<
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
        // const response = await api.get('/users/products', {
        params: {
          // is_new: true,
          // accept_trade: true,
          // payment_methods: 'pix',
          // query: 'Cadeira',
        },
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      })
      console.log('setAllProductsPublicated', response.data)
      setAllProductsPublicated(
        response.data.map((data: any) => ({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          isNew: data.is_new,
          acceptTrade: data.accept_trade,
          userId: data.user.avatar,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          paymentMethods: data.payment_methods,
          productImages: data.product_images,
        })),
      )
      // eslint-disable-next-line
    } catch (error) {
      console.log('response error ProductContextProvider', error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  const getMyProductRegistered = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      const response = await api.get('/users/products', {
        params: {
          // is_new: true,
          // accept_trade: true,
          // payment_methods: 'pix',
          // query: 'Cadeira',
        },
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      })
      console.log(
        'getMyProductRegistered',
        response.data[response.data.length - 1],
      )
      setMyProductsPublicated(
        response.data.map((data: any) => ({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          isNew: data.is_new,
          acceptTrade: data.accept_trade,
          userId: data.user_id,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          paymentMethods: data.payment_methods,
          productImages: data.product_images,
        })),
      )
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

  const handleCreateNewPost = useCallback(
    (data: ProductDTO, img: any[]) => {
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

      console.log('productCreatedAndReadyToPost', {
        productCreatedAndReadyToPost,
        img,
      })
    },
    [productCreatedAndReadyToPost],
  )

  const getProductById = useCallback(async (id: string) => {
    // eslint-disable-next-line
    try {
      const { data } = await api.get(`/products/${id}`)
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        isNew: data.is_new,
        acceptTrade: data.accept_trade,
        userId: data.user_id,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        paymentMethods: data.payment_methods.map((payment: any) => payment.key),
        productImages: data.product_images,
      }
    } catch (error) {
      throw error
    }
  }, [])

  const handleConfirmCreateNewPost = useCallback(async () => {
    // eslint-disable-next-line
    const {name, description, isNew, price, acceptTrade, paymentMethods} = productCreatedAndReadyToPost
    try {
      // ERROR "Um ou mais métodos de pagamento são inválidos."
      const response = await api.post('/products', {
        name,
        description,
        is_new: isNew,
        price,
        accept_trade: acceptTrade,
        payment_methods: paymentMethods,
      })

      try {
        const imagesForm = new FormData()
        imagesForm.append('product_id', response.data.id)
        for (const newImage of imageOfProductCreatedAndReadyToPost) {
          imagesForm.append('images', newImage as any)
        }

        await api.post('/products/images', imagesForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } catch (errorImage: any) {
        const textoError =
          errorImage?.message === 'Internal server error'
            ? 'A imagem não pode ser salva, vá nos detalhes da sua postagem e tente fazer o upload da imagem novamente.'
            : `A postagem foi feita, mas ocorreu um erro ao carregar a imagem: ${errorImage.message}. Vá nos detalhes da sua postagem e tente fazer o upload da imagem novamente.`

        throw new Error(textoError)
      }
    } catch (error) {
      console.log('response error ProductContextProvider', error)
      throw error
    }
  }, [productCreatedAndReadyToPost, imageOfProductCreatedAndReadyToPost])

  const valuesProvider = useMemo(() => {
    return {
      getMyProductRegistered,
      imageOfProductCreatedAndReadyToPost,
      handleCreateNewPost,
      allProductsPublicated,
      productCreatedAndReadyToPost,
      getAllProductRegistered,
      isLoadingUserStorageData,
      handleConfirmCreateNewPost,
      myProductsPublicated,
      getProductById,
    }
  }, [
    getMyProductRegistered,
    imageOfProductCreatedAndReadyToPost,
    handleCreateNewPost,
    allProductsPublicated,
    productCreatedAndReadyToPost,
    getAllProductRegistered,
    isLoadingUserStorageData,
    handleConfirmCreateNewPost,
    myProductsPublicated,
    getProductById,
  ])

  return (
    <ProductContext.Provider value={valuesProvider}>
      {children}
    </ProductContext.Provider>
  )
}
