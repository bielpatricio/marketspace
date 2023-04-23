import * as Header from '@components/Header'
import { ListAds } from '@components/ListAds'
import { useProduct } from '@hooks/useProduct'
import { AppError } from '@utils/AppError'
import { HStack, Text, VStack, Select, Box, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'

export function MyAds() {
  const { myProductsPublicated, getMyProductRegistered } = useProduct()
  const [filter, setFilter] = useState('all')

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const getAllProductRegistered = useCallback(async () => {
    try {
      setIsLoading(true)
      await getAllProductRegistered()
      // eslint-disable-next-line
    } catch (error) {
      console.log('error getAllProductRegistered', error)
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Error login. Try again later.'

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
    getMyProductRegistered()
  }, [getMyProductRegistered])

  const getMyProductsFiltered = useCallback(() => {
    if (filter === 'is_active') {
      return myProductsPublicated.filter((product) => product.isActive)
    }

    if (filter === 'is_not_active') {
      return myProductsPublicated.filter((product) => !product.isActive)
    }

    return myProductsPublicated
  }, [filter, myProductsPublicated])

  return (
    <VStack px={6} flex={1} bg="gray.600">
      <Header.Root>
        <HStack width={12}></HStack>
        <Header.Title title="Meus anúncios" />
        <Header.PlusButton />
      </Header.Root>

      <HStack alignItems="center" justifyContent="space-between">
        <Text alignItems="flex-start" fontSize="sm" color="gray.300" mb={3}>
          {myProductsPublicated.length} anúncios ativos
        </Text>

        <Select
          defaultValue="all"
          selectedValue={filter}
          minWidth={32}
          onValueChange={setFilter}
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Ativos" value="is_active" />
          <Select.Item label="Desativados" value="is_not_active" />
        </Select>
      </HStack>

      <ListAds data={getMyProductsFiltered()} isLoading={isLoading} />
    </VStack>
  )
}
