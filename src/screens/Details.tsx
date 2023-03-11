import { Avatar } from '@components/Avatar'
import { Header } from '@components/Header'
import { ProductDTO } from '@dtos/ProductDTO'
import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import { api } from '@services/axios'
import { theme } from '@styles/default'
import { HStack, Icon, Image, Text, VStack } from 'native-base'
import { Bank, Barcode, CreditCard, Money, QrCode } from 'phosphor-react-native'
import { useEffect, useState } from 'react'

type RouteParams = {
  postId: string
}

export function Details() {
  const route = useRoute()
  const { user } = useAuth()
  const { productCreatedAndReadyToPost } = useProduct()

  const { postId } = route.params as RouteParams
  console.log('postId', postId)

  const [productToShowInScreen, setProductToShowInScreen] =
    useState<ProductDTO>({} as ProductDTO)

  useEffect(() => {
    if (postId !== (undefined || '' || null)) {
      setProductToShowInScreen(productCreatedAndReadyToPost)

      console.log('productCreatedAndReadyToPost', productCreatedAndReadyToPost)
    }
  }, [postId, productCreatedAndReadyToPost])

  function handleSelectIcon(iconName: string) {
    switch (iconName) {
      case 'barcode':
        return (
          <HStack alignItems="center">
            <Icon
              as={<Barcode size={20} color={`${theme.colors.gray['100']}`} />}
              mr={2}
            />
            <Text color="gray.100">Boleto</Text>
          </HStack>
        )
      case 'pix':
        return (
          <HStack alignItems="center">
            <Icon
              as={<QrCode size={20} color={`${theme.colors.gray['100']}`} />}
              mr={2}
            />
            <Text color="gray.100">Pix</Text>
          </HStack>
        )
      case 'cash':
        return (
          <HStack alignItems="center">
            <Icon
              as={<Money size={20} color={`${theme.colors.gray['100']}`} />}
              mr={2}
            />
            <Text color="gray.100">Dinheiro</Text>
          </HStack>
        )
      case 'card':
        return (
          <HStack alignItems="center">
            <Icon
              as={
                <CreditCard size={20} color={`${theme.colors.gray['100']}`} />
              }
              mr={2}
            />
            <Text color="gray.100">Cartão de Crédito</Text>
          </HStack>
        )
      case 'deposit':
        return (
          <HStack alignItems="center">
            <Icon
              as={<Bank size={20} color={`${theme.colors.gray['100']}`} />}
              mr={2}
            />
            <Text color="gray.100">Depósito Bancário</Text>
          </HStack>
        )
    }
  }

  return (
    <VStack>
      <Header
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
        backIcon={postId === (undefined || '' || null)}
        editIcon={postId === (undefined || '' || null)}
      />

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
          <Text fontSize="lg" fontWeight="bold" color="purple.500">
            R$ {productToShowInScreen.price / 100}
          </Text>
        </HStack>

        <VStack mt={5}>
          <Text fontSize="md" fontWeight="bold" color="gray.100">
            Descrição:
          </Text>
          <Text fontSize="md" ml={3} color="gray.100">
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
                  <HStack alignItems="center">
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
                  <HStack alignItems="center">
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
                  <HStack alignItems="center">
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
                  <HStack alignItems="center">
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
                  <HStack alignItems="center">
                    <Icon
                      as={
                        <Bank size={20} color={`${theme.colors.gray['100']}`} />
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
    </VStack>
  )
}
