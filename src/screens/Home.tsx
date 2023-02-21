import { AdsCard } from '@components/AdsCard'
import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
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
import { theme } from '@styles/default'
import { AppError } from '@utils/AppError'
import {
  Center,
  FlatList,
  HStack,
  Icon,
  ScrollView,
  SectionList,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { Plus, User } from 'phosphor-react-native'
import { useCallback, useEffect, useState } from 'react'
import { ImageURISource, Platform } from 'react-native'

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

  function handleCreateNewList() {
    let temporaryProductList: ProductDTO[] = []
    const productList: ProductDTO[][] = []

    products?.forEach((product, idx) => {
      temporaryProductList.push(product)

      if (idx % 2 === 0) {
        productList.push(temporaryProductList)
        temporaryProductList = []
      }

      if (products.length === idx - 1 && idx % 2 !== 0) {
        productList.push(temporaryProductList)
      }
    })
    console.log('Producttttttttttttttttttt', productList)
    setNewProductList(productList)
  }

  useFocusEffect(
    useCallback(() => {
      handleCreateNewList()
    }, []),
  )

  const [newProductList, setNewProductList] = useState<ProductDTO[][]>([])
  const [products, setProducts] = useState<ProductDTO[]>([
    {
      id: '46df47e7-d7b3-47e5-8870-7d5068105c16',
      name: 'Luminária Pendente',
      description:
        'Essa é a melhor luminária do mundo. Você não vai se arrepender',
      is_new: true,
      price: 45000,
      accept_trade: true,
      user_id: 'd20c858a-849c-4d0f-8082-00e93b20dd0c',
      is_active: true,
      created_at: '2022-11-14T23:54:58.968Z',
      updated_at: '2022-11-14T23:54:58.968Z',
    },
    {
      id: '46df47e7-d7b3-47e5-8870-7d5068105c20',
      name: 'Tenis Pendente',
      description:
        'Essa é a melhor luminária do mundo. Você não vai se arrepender',
      is_new: false,
      price: 70000,
      accept_trade: true,
      user_id: 'd20c858a-849c-4d0f-8082-00e93b20dd0c',
      is_active: true,
      created_at: '2022-11-14T23:54:58.968Z',
      updated_at: '2022-11-14T23:54:58.968Z',
    },
    {
      id: '46df47e7-d7b3-47e5-8870-7d5068105c88',
      name: 'Tenis Pendente',
      description:
        'Essa é a melhor luminária do mundo. Você não vai se arrepender',
      is_new: false,
      price: 90000,
      accept_trade: true,
      user_id: 'd20c858a-849c-4d0f-8082-00e93b20dd0c',
      is_active: true,
      created_at: '2022-11-14T23:54:58.968Z',
      updated_at: '2022-11-14T23:54:58.968Z',
    },
    {
      id: '46df47e7-d7b3-47e5-8870-7d5068105c81',
      name: 'Tenis Pendente',
      description:
        'Essa é a melhor luminária do mundo. Você não vai se arrepender',
      is_new: false,
      price: 90000,
      accept_trade: true,
      user_id: 'd20c858a-849c-4d0f-8082-00e93b20dd0c',
      is_active: true,
      created_at: '2022-11-14T23:54:58.968Z',
      updated_at: '2022-11-14T23:54:58.968Z',
    },
    {
      id: '46df47e7-d7b3-47e5-8870-7d5068105c82',
      name: 'Tenis Pendente',
      description:
        'Essa é a melhor luminária do mundo. Você não vai se arrepender',
      is_new: false,
      price: 90000,
      accept_trade: true,
      user_id: 'd20c858a-849c-4d0f-8082-00e93b20dd0c',
      is_active: true,
      created_at: '2022-11-14T23:54:58.968Z',
      updated_at: '2022-11-14T23:54:58.968Z',
    },
  ])

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
          ListHeaderComponent={() => (
            <>
              <MyAds />
              <FilterComponent />
            </>
          )}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={[
            { paddingBottom: 100 }, // quando acaba
            products.length === 0 && {
              flex: 1,
              justifyContent: 'center',
            },
          ]}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  )
}
