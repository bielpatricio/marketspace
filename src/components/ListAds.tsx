import { useProduct } from '@hooks/useProduct'
import { AppError } from '@utils/AppError'
import { FlatList, Text, VStack, useToast } from 'native-base'
import { useCallback, useState } from 'react'
import { FilterComponent } from './FilterComponent'
import { MyAds } from './MyAds'
import { Loading } from './Loading'
import { AdsCard } from './AdsCard'
import { ProductDTO } from '@dtos/ProductDTO'

type ListAdsProps = {
  isHome?: boolean
  data: ProductDTO[]
  isLoading: boolean
}

export function ListAds({ isHome = false, data, isLoading }: ListAdsProps) {
  const renderHeaderComponentList = useCallback(() => {
    return (
      <VStack>
        {isHome && (
          <>
            <FilterComponent />
            <MyAds />
          </>
        )}
        {data.length === 0 && (
          <VStack justifyContent="center" alignItems="center">
            <Text py={20} fontWeight="bold" color="gray.100">
              Sem Produtos anunciados
            </Text>
          </VStack>
        )}
      </VStack>
    )
  }, [data])
  return (
    <>
      {!isLoading ? (
        <FlatList // substituir o map -> ele renderiza apenas os elementos que cabem na tela
          data={data}
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
    </>
  )
}
