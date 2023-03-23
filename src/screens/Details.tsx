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
import {
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
  } = useProduct()

  const navigation = useNavigation()

  const { postId } = route.params as RouteParams
  console.log('postId', postId)

  const [productToShowInScreen, setProductToShowInScreen] =
    useState<ProductDTO>({} as ProductDTO)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (postId !== (undefined || '' || null)) {
      setProductToShowInScreen(productCreatedAndReadyToPost)

      console.log('productCreatedAndReadyToPost', productCreatedAndReadyToPost)
    }
  }, [postId, productCreatedAndReadyToPost])

  const toast = useToast()

  const handlePostProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      await handleConfirmCreateNewPost()
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

  console.log(
    'imageOfProductCreatedAndReadyToPost',
    imageOfProductCreatedAndReadyToPost,
  )

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
          <HStack width={12}></HStack>
          {postId ? <Header.EditButton /> : <HStack width={12}></HStack>}
        </Header.Root>

        {/* <HStack bgColor="amber.400" minH={72}>
          <Image
            w="full"
            rounded="2xl"
            // source={{ uri: imageBg }}
            source={{ uri: imageOfProductCreatedAndReadyToPost[0].uri }}
            alt="image"
          />
        </HStack> */}

        <VStack padding={4}>
          <HStack flexWrap="wrap" alignItems="center">
            <Avatar
              size={14}
              source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
              alt="User Avatar"
            />

            <Text ml={2} fontWeight="bold" color="gray.100">
              {user.name}
            </Text>
          </HStack>

          <HStack
            mt={10}
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

          <HStack mt={10}>
            <Text fontSize="md" fontWeight="bold" color="gray.100">
              Aceita troca?
            </Text>
            <Text fontSize="md" ml={3} color="gray.100">
              {productToShowInScreen.acceptTrade ? 'Sim' : 'Não'}
            </Text>
          </HStack>

          <VStack mt={10}>
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
