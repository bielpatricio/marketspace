import { ProductDTO } from '@dtos/ProductDTO'
import {
  Center,
  HStack,
  Image,
  Link,
  Pressable,
  Text,
  VStack,
  View,
} from 'native-base'
import { Avatar } from './Avatar'

import imageBg from '@assets/image404.jpg'
import { api } from '@services/axios'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import { IsNew } from './IsNew'
import { useAuth } from '@hooks/useAuth'

type AdsCardProps = {
  product: ProductDTO
}

export function AdsCard({ product }: AdsCardProps) {
  const navigation = useNavigation<AppNavigatorRoutesStackProps>()

  const { user } = useAuth()

  // console.log(`productxxxx`, product)

  return (
    <Pressable
      flex={1}
      my={3}
      maxW="48%"
      onPress={() => navigation.navigate('details', { postId: product.id })}
    >
      {/* <TouchableWithoutFeedback onPress={() => console.log('aee')}>
        <> */}
      <VStack position="relative" flex={1} h={26} rounded="2xl">
        <Image
          w="full"
          rounded="2xl"
          position="absolute"
          source={
            product?.productImages && product?.productImages?.length > 0
              ? {
                  uri: `${api.defaults.baseURL}/images/${product?.productImages[0]?.path}`,
                }
              : imageBg
          }
          h={26}
          resizeMode="contain"
          alt="image"
        />
        <HStack
          padding={2}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {user.avatar && product.userId !== user.id ? (
            <Avatar
              size={9}
              source={{
                uri: `${api.defaults.baseURL}/images/${product.userId}`,
              }}
              alt="User Avatar"
              resizeMode="contain"
            />
          ) : (
            <VStack></VStack>
          )}
          <IsNew isNew={product.isNew} />
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
      {/* </>
      </TouchableWithoutFeedback> */}
    </Pressable>
  )
}
