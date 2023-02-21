import { ProductDTO } from '@dtos/ProductDTO'
import { Center, HStack, Image, Text, VStack, View } from 'native-base'
import { Avatar } from './Avatar'

import imageBg from '@assets/bgProduct.png'
import { ImageBackground } from 'react-native'

type AdsCardProps = {
  product: ProductDTO
}

export function AdsCard({ product }: AdsCardProps) {
  return (
    <VStack flex={1} mb={5} maxW="48%">
      <VStack position="relative" flex={1} h={26} rounded="2xl">
        <Image
          w="full"
          rounded="2xl"
          position="absolute"
          // source={{ uri: imageBg }}
          source={imageBg}
          alt="image"
        />
        <HStack padding={2} alignItems="center" justifyContent="space-between">
          <Avatar
            size={9}
            source={{ uri: `https://github.com/bielpatricio.png` }}
            alt="User Avatar"
          />
          <Center
            rounded="3xl"
            py={1}
            px={4}
            bg={product.is_new ? 'purple.500' : 'gray.300'}
          >
            <Text color={'gray.600'} fontSize="xs" fontWeight="bold">
              {product.is_new ? 'NOVO' : 'USADO'}
            </Text>
          </Center>
        </HStack>
      </VStack>

      <Text color={'gray.300'} fontSize="sm">
        {product.name}
      </Text>
      <HStack alignItems="flex-end">
        <Text color={'gray.100'} fontSize="sm" fontWeight="bold">
          R$
        </Text>
        <Text ml={2} color={'gray.100'} fontSize="md" fontWeight="bold">
          {(product.price / 100).toFixed(2).toString().replace('.', ',')}
        </Text>
      </HStack>
    </VStack>
  )
}
