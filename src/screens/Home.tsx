import { AdsCard } from '@components/AdsCard'
import { FilterComponent } from '@components/FilterComponent'
import { HomeHeader } from '@components/HomeHeader'
import { ListAds } from '@components/ListAds'
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
  const { allProductsPublicated, getAllProductRegistered } = useProduct()

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const getAllProductRegisteredHome = useCallback(async () => {
    try {
      setIsLoading(true)
      await getAllProductRegistered()
      // eslint-disable-next-line
    } catch (error) {
      console.log('error getAllProductRegistered', error)
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
  }, [toast])

  useEffect(() => {
    getAllProductRegisteredHome()
  }, [])

  console.log('allProductsPublicated', allProductsPublicated)

  return (
    <VStack px={6} flex={1} pt={16} bg="gray.600">
      <HomeHeader name={user.name} avatar={user.avatar} />
      <ListAds
        isHome={true}
        data={allProductsPublicated}
        isLoading={isLoading}
      />
    </VStack>
  )
}
