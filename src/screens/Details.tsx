/* eslint-disable jsx-a11y/alt-text */
import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
import * as Header from '@components/Header'
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
  FlatList,
  HStack,
  Icon,
  ScrollView,
  Text,
  Image,
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
  TrashSimple,
  Power,
  WhatsappLogo,
} from 'phosphor-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from '../components/Loading'
import { IsNew } from '@components/IsNew'
import { Alert, Image as ImageReact, View } from 'react-native'

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
    deleteProductById,
    patchProductById,
    getMyProductRegistered,
    handlePutPost,
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

  const handleShowProductToPost = useCallback(() => {
    setIsLoading(true)
    setProductToShowInScreen({
      ...productCreatedAndReadyToPost,
      productImages: imageOfProductCreatedAndReadyToPost,
    })
    setIsLoading(false)
  }, [imageOfProductCreatedAndReadyToPost, productCreatedAndReadyToPost])

  useEffect(() => {
    if (!postId) {
      handleShowProductToPost()
    } else {
      handleGetProductById()
    }
  }, [postId, handleGetProductById, handleShowProductToPost])

  const handlePostProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      handleConfirmCreateNewPost()
      await getMyProductRegistered()
      toast.show({
        title: 'Anúncio postado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })
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
  }, [toast, handleConfirmCreateNewPost, navigation, getMyProductRegistered])

  const handlePutProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      handlePutPost(productToShowInScreen.id)
      await getMyProductRegistered()
      toast.show({
        title: 'Anúncio editado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })
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
  }, [
    toast,
    navigation,
    getMyProductRegistered,
    handlePutPost,
    productToShowInScreen,
  ])

  const handlePatchProductById = useCallback(async () => {
    try {
      setIsLoading(true)
      await patchProductById(postId, productToShowInScreen.isActive)
      const title = productToShowInScreen.isActive
        ? 'Anúncio desativado com sucesso'
        : 'Anúncio reativado com sucesso'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'green.500',
      })
      handleGetProductById()
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro para editar anúncio. Tente novamente em instantes.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [
    postId,
    toast,
    patchProductById,
    productToShowInScreen,
    handleGetProductById,
  ])

  const handleConfirmPatchProductById = useCallback(async () => {
    const text = productToShowInScreen.isActive
      ? 'Tem certeza que deseja desativar o anúncio?'
      : 'Tem certeza que deseja reativar o anúncio?'
    const title = productToShowInScreen.isActive
      ? 'Desativar anúncio'
      : 'Reativar anúncio'
    Alert.alert(title, text, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Sim', onPress: () => handlePatchProductById() },
    ])
  }, [handlePatchProductById, productToShowInScreen])

  const handleDeleteProductById = useCallback(async () => {
    try {
      setIsLoading(true)
      await deleteProductById(postId)
      await getMyProductRegistered()
      toast.show({
        title: 'Anúncio deletado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })
      navigation.navigate('initial')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Erro para deletar anúncio. Tente novamente em instantes.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [postId, toast, deleteProductById, navigation, getMyProductRegistered])

  const handleConfirmDeleteProductById = useCallback(async () => {
    Alert.alert(
      'Deletar anúncio',
      'Tem certeza que deseja deletar o anúncio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => handleDeleteProductById() },
      ],
    )
  }, [handleDeleteProductById])

  const handleButtonsToShow = useCallback(() => {
    if (!postId && productToShowInScreen.id === '1-PROVISORY-ID-9') {
      return (
        <HStack borderRadius={10} bgColor="gray.700" padding={6}>
          <Button
            w="1/2"
            mr={1}
            ml={-1}
            h={12}
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
            h={12}
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
      )
    }

    if (!postId && productToShowInScreen.id !== '1-PROVISORY-ID-9') {
      return (
        <HStack borderRadius={10} bgColor="gray.700" padding={6}>
          <Button
            w="1/2"
            mr={1}
            ml={-1}
            h={12}
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
            h={12}
            title="Editar"
            bgColor="purple.300"
            variant="purple"
            onPress={handlePutProduct}
            icon={
              <PencilSimpleLine
                size={20}
                weight="bold"
                color={`${theme.colors.gray[700]}`}
              />
            }
          />
        </HStack>
      )
    }

    if (productToShowInScreen.userId === user.id) {
      return (
        <VStack borderRadius={10} bgColor="gray.700" padding={6}>
          <Button
            mb={1}
            h={12}
            variant={'black'}
            title={
              productToShowInScreen.isActive
                ? 'Desativar anúncio'
                : 'Reativar anúncio'
            }
            bgColor={
              productToShowInScreen.isActive
                ? `${theme.colors.gray[100]}`
                : 'purple.300'
            }
            onPress={handleConfirmPatchProductById}
            icon={
              <Power
                size={20}
                weight="bold"
                color={`${theme.colors.gray[700]}`}
              />
            }
          />
          <Button
            mt={1}
            h={12}
            title="Excluir anúncio"
            onPress={handleConfirmDeleteProductById}
            icon={
              <TrashSimple
                size={20}
                weight="bold"
                color={`${theme.colors.gray[100]}`}
              />
            }
          />
        </VStack>
      )
    }

    return (
      <HStack
        justifyContent="space-between"
        borderRadius={10}
        bgColor="gray.700"
        padding={6}
      >
        <HStack
          flexWrap="wrap"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Text
            mb={1}
            mr={2}
            fontSize="md"
            fontWeight="bold"
            color="purple.300"
          >
            R$
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="purple.300">
            {(productToShowInScreen.price / 100)
              .toFixed(2)
              .replace('.', ',')
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
          </Text>
        </HStack>
        <Button
          w="1/2"
          ml={1}
          h={12}
          title="Entrar em contato"
          bgColor="purple.300"
          variant="purple"
          onPress={handlePostProduct}
          icon={
            <WhatsappLogo
              size={20}
              weight="bold"
              color={`${theme.colors.gray[700]}`}
            />
          }
        />
      </HStack>
    )
  }, [
    handlePatchProductById,
    handleDeleteProductById,
    handlePostProduct,
    productToShowInScreen,
    user,
    postId,
    handlePutProduct,
    navigation,
  ])

  const imageDefault = useCallback(() => {
    return (
      // <Image
      //   w="full"
      //   source={imageBg}
      //   alt="image"
      //   h="full"
      //   resizeMode="contain"
      // />
      <ImageReact
        accessibilityLabel="product image"
        source={imageBg}
        style={{ height: 400, width: 400 }}
        resizeMode="contain"
      />
    )
  }, [])

  return (
    <VStack h="full">
      {isLoading ? (
        <Center h="full" flex={1}>
          <Loading />
        </Center>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Header.Root
              bgColor={
                productToShowInScreen.userId === user.id
                  ? 'purple.300'
                  : 'transparent'
              }
            >
              {postId ? <Header.BackButton /> : <HStack width={12}></HStack>}

              <Header.Title
                color={
                  productToShowInScreen.userId === user.id
                    ? 'gray.600'
                    : 'transparent'
                }
                title={
                  postId && productToShowInScreen.userId === user.id
                    ? ''
                    : 'Pré visualização do anúncio'
                }
                subtitle={
                  postId && productToShowInScreen.userId === user.id
                    ? ''
                    : 'É assim que seu produto vai aparecer!'
                }
              />
              {postId && productToShowInScreen.userId === user.id ? (
                <Header.EditButton
                  onPress={() =>
                    navigation.navigate('create', {
                      postId: productToShowInScreen.id,
                    })
                  }
                />
              ) : (
                <HStack width={12}></HStack>
              )}
            </Header.Root>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={
                postId
                  ? productToShowInScreen?.productImages
                  : imageOfProductCreatedAndReadyToPost
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const URI_PATH = postId
                  ? `${api.defaults.baseURL}/images/${item.path}`
                  : item.uri
                console.log('item', URI_PATH)
                return (
                  // <HStack h={72} bgColor={`amber.${index + 1}00`}>
                  //   <Image
                  //     // w="full"
                  //     // source={{ uri: URI_PATH }}
                  //     source={imageBg}
                  //     alt="image"
                  //     h="full"
                  //     resizeMode="contain"
                  //   />
                  // </HStack>
                  <View style={{ height: 400 }}>
                    <ImageReact
                      accessibilityLabel="product image"
                      source={{ uri: URI_PATH }}
                      style={{ height: 400, width: 400 }}
                      resizeMode="contain"
                    />
                  </View>
                )
              }}
              ListEmptyComponent={imageDefault}
            />

            <VStack padding={4}>
              <HStack flexWrap="wrap" alignItems="center">
                <Avatar
                  size={8}
                  source={{
                    uri: `${api.defaults.baseURL}/images/${user.avatar}`,
                  }}
                  alt="User Avatar"
                />

                <Text ml={2} fontWeight="bold" color="gray.100">
                  {user.name}
                </Text>
              </HStack>

              <HStack mt={4}>
                <IsNew isNew={productToShowInScreen.isNew} />
              </HStack>
              <HStack
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text fontSize="lg" fontWeight="bold" color="gray.100">
                  {productToShowInScreen.name}
                </Text>
                <HStack
                  flexWrap="wrap"
                  alignItems="flex-end"
                  justifyContent="space-between"
                >
                  <Text
                    mb={1}
                    mr={1}
                    fontSize="sm"
                    fontWeight="bold"
                    color="purple.300"
                  >
                    R$
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="purple.300">
                    {(productToShowInScreen.price / 100)
                      .toFixed(2)
                      .replace('.', ',')
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                  </Text>
                </HStack>
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

              <VStack mt={5} mb={10}>
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

            {handleButtonsToShow()}
          </ScrollView>
        </>
      )}
    </VStack>
  )
}
