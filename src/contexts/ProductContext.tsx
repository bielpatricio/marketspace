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

type ProductParams = {
  isNew?: boolean | null
  acceptTrade?: boolean | null
  paymentMethods?: string[] | null
  query?: string
}

type ProductContextDataProps = {
  allProductsPublicated: ProductDTO[]
  myProductsPublicated: ProductDTO[]
  isLoading: boolean
  productCreatedAndReadyToPost: ProductDTO
  getAllProductRegistered: (params: ProductParams) => Promise<void>
  getMyProductRegistered: () => Promise<void>
  isLoadingUserStorageData: boolean
  handleCreateNewPost: (data: ProductDTO, img: any) => void
  handleConfirmCreateNewPost: () => void
  imageOfProductCreatedAndReadyToPost: any[]
  getProductById: (id: string) => Promise<ProductDTO>
  deleteProductById: (id: string) => Promise<void>
  patchProductById: (id: string, isActive: boolean) => Promise<void>
  handlePutPost: (id: string) => void
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

  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  const getAllProductRegistered = useCallback(
    async ({
      isNew = null,
      acceptTrade = null,
      paymentMethods = null,
      query = '',
    }: ProductParams) => {
      try {
        setIsLoading(true)
        setIsLoadingUserStorageData(true)
        console.log('params', {
          is_new: isNew,
          accept_trade: acceptTrade,
          payment_methods: paymentMethods,
          query,
        })
        const response = await api.get('/products', {
          // const response = await api.get('/users/products', {
          params: {
            is_new: isNew,
            accept_trade: acceptTrade,
            payment_methods: paymentMethods,
            query,
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
        setIsLoading(false)
      }
    },
    [],
  )

  const deleteProductById = useCallback(async (id: string) => {
    try {
      setIsLoadingUserStorageData(true)
      await api.delete(`/products/${id}`)
      // console.log('deleteProductById', response)
      // eslint-disable-next-line
    } catch (error) {
      // console.log('response error ProductContextProvider', error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  const patchProductById = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        setIsLoadingUserStorageData(true)
        await api.patch(`/products/${id}`, {
          is_active: !isActive,
        })
        // eslint-disable-next-line
    } catch (error) {
        throw error
      } finally {
        setIsLoadingUserStorageData(false)
      }
    },
    [],
  )

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

  const handlePutPost = useCallback(
    async (id: string) => {
      // eslint-disable-next-line
    const {name, description, isNew, price, acceptTrade, paymentMethods} = productCreatedAndReadyToPost
      try {
        // ERROR "Um ou mais métodos de pagamento são inválidos."
        const response = await api.put(`/products/${id}`, {
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
    },
    [productCreatedAndReadyToPost, imageOfProductCreatedAndReadyToPost],
  )

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
      deleteProductById,
      patchProductById,
      handlePutPost,
      isLoading,
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
    deleteProductById,
    patchProductById,
    handlePutPost,
    isLoading,
  ])

  return (
    <ProductContext.Provider value={valuesProvider}>
      {children}
    </ProductContext.Provider>
  )
}
