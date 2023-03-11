import { AdsCard } from '@components/AdsCard'
import { FilterComponent } from '@components/FilterComponent'
import { HomeHeader } from '@components/HomeHeader'
import { Loading } from '@components/Loading'
import { MyAds } from '@components/MyAds'
import { ProductDTO } from '@dtos/ProductDTO'
import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'
import { useFocusEffect } from '@react-navigation/native'
import { api } from '@services/axios'
import { storageAuthTokenGet } from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import { FlatList, Text, VStack, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'

export function Home() {
  const { user } = useAuth()
  // const { getAllProductRegistered } = useProduct()

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const getAllProductRegistered = useCallback(async () => {
    try {
      setIsLoading(true)
      const { token } = await storageAuthTokenGet()
      console.log(
        'response error api.defaults.headers.common.Authorization',
        token,
      )
      const response = await api.get('/products', {
        params: {
          is_new: true,
          accept_trade: true,
          // payment_methods: 'pix',
          // query: 'Cadeira',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('response meeee', response.data)
      setProducts(response.data)
      // eslint-disable-next-line
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Error login. Try again later.'

      // setIsLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllProductRegistered()
  }, [getAllProductRegistered])

  // function handleCreateNewList() {
  //   let temporaryProductList: ProductDTO[] = []
  //   const productList: ProductDTO[][] = []

  //   products?.forEach((product, idx) => {
  //     temporaryProductList.push(product)

  //     if (idx % 2 === 0) {
  //       productList.push(temporaryProductList)
  //       temporaryProductList = []
  //     }

  //     if (products.length === idx - 1 && idx % 2 !== 0) {
  //       productList.push(temporaryProductList)
  //     }
  //   })
  //   console.log('Producttttttttttttttttttt', productList)
  //   setNewProductList(productList)
  // }

  // useFocusEffect(
  //   useCallback(() => {
  //     handleCreateNewList()
  //   }, []),
  // )

  // const [newProductList, setNewProductList] = useState<ProductDTO[][]>([])
  const [products, setProducts] = useState<ProductDTO[]>([])

  const renderHeaderComponentList = useCallback(() => {
    return (
      <VStack>
        <FilterComponent />
        <MyAds />
        {products.length === 0 && (
          <VStack justifyContent="center" alignItems="center">
            <Text py={20} fontWeight="bold" color="gray.100">
              Sem Produtos anunciados
            </Text>
          </VStack>
        )}
      </VStack>
    )
  }, [products])

  return (
    <VStack px={6} flex={1} pt={16} bg="gray.600">
      <HomeHeader name={user.name} avatar={user.avatar} />
      {!isLoading ? (
        <FlatList // substituir o map -> ele renderiza apenas os elementos que cabem na tela
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AdsCard product={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListHeaderComponent={renderHeaderComponentList}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={[
            { paddingBottom: 100 }, // quando acaba
          ]}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  )
}
