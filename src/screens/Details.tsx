import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
import * as Header from '@components/Header'
import { ImageAds } from '@components/ImageAds'
import { ProductDTO } from '@dtos/ProductDTO'
import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import { api } from '@services/axios'
import { theme } from '@styles/default'
import { AppError } from '@utils/AppError'
import imageBg from '@assets/image404.jpg'
import {
  Center,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
  ArrowLeft,
  PencilSimpleLine,
} from 'phosphor-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from '../components/Loading'
import { IsNew } from '@components/IsNew'

type RouteParams = {
  postId: string
}

export function Details() {
  const route = useRoute()
  const { user } = useAuth()
  const {
    productCreatedAndReadyToPost,
    imageOfProductCreatedAndReadyToPost,
    handleConfirmCreateNewPost,
    getProductById,
  } = useProduct()

  const navigation = useNavigation<AppNavigatorRoutesStackProps>()

  const { postId } = route.params as RouteParams
  console.log('postId', postId)

  const [productToShowInScreen, setProductToShowInScreen] =
    useState<ProductDTO>({} as ProductDTO)
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const handleGetProductById = useCallback(async () => {
    try {
      setIsLoading(true)
      const data: ProductDTO = await getProductById(postId)
      console.log('dataxxxxxxxxxxxx', data)
      setProductToShowInScreen(data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro para carregar anúncios. Tente novamente em instantes.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [postId, toast, getProductById])

  useEffect(() => {
    if (!postId) {
      setProductToShowInScreen({
        ...productCreatedAndReadyToPost,
        productImages: imageOfProductCreatedAndReadyToPost,
      })
    } else {
      handleGetProductById()
    }
  }, [postId, handleGetProductById])

  const handlePostProduct = useCallback(() => {
    try {
      setIsLoading(true)
      handleConfirmCreateNewPost()
      navigation.navigate('initial')
      // eslint-disable-next-line
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro para postar anúncios. Tente novamente em instantes.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast, handleConfirmCreateNewPost, navigation])

  console.log('productToShowInScreen', productToShowInScreen?.paymentMethods)

  return (
    <VStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header.Root bgColor="purple.300">
          {postId ? <Header.BackButton /> : <HStack width={12}></HStack>}

          <Header.Title
            color="gray.600"
            title={
              postId !== (undefined || '' || null)
                ? 'Pré visualização do anúncio'
                : ''
            }
            subtitle={
              postId !== (undefined || '' || null)
                ? 'É assim que seu produto vai aparecer!'
                : ''
            }
          />
          {postId ? <Header.EditButton /> : <HStack width={12}></HStack>}
        </Header.Root>

        <HStack minH={72}>
          <Image
            w="full"
            source={
              productToShowInScreen?.productImages &&
              productToShowInScreen?.productImages?.length > 0
                ? {
                    uri: `${api.defaults.baseURL}/images/${productToShowInScreen?.productImages[0]?.path}`,
                  }
                : imageBg
            }
            alt="image"
            h="full"
          />
        </HStack>

        <VStack padding={4}>
          <HStack flexWrap="wrap" alignItems="center">
            <Avatar
              size={8}
              source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
              alt="User Avatar"
            />

            <Text ml={2} fontWeight="bold" color="gray.100">
              {user.name}
            </Text>
          </HStack>

          <HStack mt={4}>
            <IsNew isNew={false} />
          </HStack>
          <HStack
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="lg" fontWeight="bold" color="gray.100">
              {productToShowInScreen.name}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="purple.300">
              R${' '}
              {(productToShowInScreen.price / 100)
                .toFixed(2)
                .replace('.', ',')
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
            </Text>
          </HStack>

          <VStack mt={5}>
            <Text fontSize="md" fontWeight="bold" color="gray.100">
              Descrição:
            </Text>
            <Text fontSize="md" p={3} color="gray.100">
              {productToShowInScreen.description}
            </Text>
          </VStack>

          <HStack mt={5}>
            <Text fontSize="md" fontWeight="bold" color="gray.100">
              Aceita troca?
            </Text>
            <Text fontSize="md" ml={3} color="gray.100">
              {productToShowInScreen.acceptTrade ? 'Sim' : 'Não'}
            </Text>
          </HStack>

          <VStack mt={5} mb={20}>
            <Text fontSize="md" mb={2} fontWeight="bold" color="gray.100">
              Meios de pagamento:
            </Text>
            {productToShowInScreen.paymentMethods?.map((paymentMethod) => {
              switch (paymentMethod) {
                case 'boleto':
                  return (
                    <HStack key={paymentMethod} alignItems="center">
                      <Icon
                        as={
                          <Barcode
                            size={20}
                            color={`${theme.colors.gray['100']}`}
                          />
                        }
                        mr={2}
                      />
                      <Text fontSize="md" color="gray.100">
                        Boleto
                      </Text>
                    </HStack>
                  )
                case 'pix':
                  return (
                    <HStack key={paymentMethod} alignItems="center">
                      <Icon
                        as={
                          <QrCode
                            size={20}
                            color={`${theme.colors.gray['100']}`}
                          />
                        }
                        mr={2}
                      />
                      <Text fontSize="md" color="gray.100">
                        Pix
                      </Text>
                    </HStack>
                  )
                case 'cash':
                  return (
                    <HStack key={paymentMethod} alignItems="center">
                      <Icon
                        as={
                          <Money
                            size={20}
                            color={`${theme.colors.gray['100']}`}
                          />
                        }
                        mr={2}
                      />
                      <Text fontSize="md" color="gray.100">
                        Dinheiro
                      </Text>
                    </HStack>
                  )
                case 'card':
                  return (
                    <HStack key={paymentMethod} alignItems="center">
                      <Icon
                        as={
                          <CreditCard
                            size={20}
                            color={`${theme.colors.gray['100']}`}
                          />
                        }
                        mr={2}
                      />
                      <Text fontSize="md" color="gray.100">
                        Cartão de Crédito
                      </Text>
                    </HStack>
                  )
                case 'deposit':
                  return (
                    <HStack key={paymentMethod} alignItems="center">
                      <Icon
                        as={
                          <Bank
                            size={20}
                            color={`${theme.colors.gray['100']}`}
                          />
                        }
                        mr={2}
                      />
                      <Text fontSize="md" color="gray.100">
                        Depósito Bancário
                      </Text>
                    </HStack>
                  )
                default:
                  return (
                    <Text fontSize="md" color="gray.100">
                      Error
                    </Text>
                  )
              }
            })}
          </VStack>
        </VStack>
      </ScrollView>

      {isLoading ? (
        <Loading />
      ) : (
        <HStack borderRadius={10} bgColor="gray.700" padding={8}>
          <Button
            w="1/2"
            mr={1}
            ml={-1}
            title="Voltar"
            onPress={() => navigation.goBack()}
            icon={
              <ArrowLeft
                size={20}
                weight="bold"
                color={`${theme.colors.gray[100]}`}
              />
            }
          />
          <Button
            w="1/2"
            ml={1}
            title="Publicar"
            bgColor="purple.300"
            variant="purple"
            onPress={handlePostProduct}
            icon={
              <PencilSimpleLine
                size={20}
                weight="bold"
                color={`${theme.colors.gray[700]}`}
              />
            }
          />
        </HStack>
      )}
    </VStack>
  )
}
