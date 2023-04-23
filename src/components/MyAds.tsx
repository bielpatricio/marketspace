import { useProduct } from '@hooks/useProduct'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesTabProps } from '@routes/app.routes'
import { theme } from '@styles/default'
import { Button, HStack, Icon, Text, VStack } from 'native-base'
import { ArrowRight, Tag } from 'phosphor-react-native'

export function MyAds() {
  const { myProductsPublicated } = useProduct()
  const navigation = useNavigation<AppNavigatorRoutesTabProps>()

  function handleGoToMyAds() {
    navigation.navigate('myAds')
  }

  return (
    <VStack>
      <Text fontSize="sm" color="gray.300" mb={3}>
        Seus produtos anunciados para venda
      </Text>

      <HStack
        justifyContent="space-between"
        py={5}
        // mr={-2}
        pl={4}
        alignItems="flex-start"
        rounded="lg"
        background="purple.300:alpha.10"
      >
        <HStack alignItems="center" w="1/2">
          <Icon
            as={
              <Tag
                size={24}
                weight="regular"
                color={`${theme.colors.purple['500']}`}
              />
            }
            mr={5}
          />
          <VStack justifyContent="center">
            <Text fontSize="md" fontWeight="bold" color="gray.300">
              {
                myProductsPublicated.filter((product) => product.isActive)
                  .length
              }
            </Text>
            <Text fontSize="xs" color="gray.300">
              anúncios ativos
            </Text>
          </VStack>
        </HStack>

        <Button bg="transparent" w="1/2" onPress={handleGoToMyAds}>
          <HStack alignItems="center">
            <Text fontSize="xs" color="purple.500">
              Meus anúncios
            </Text>
            <Icon
              as={
                <ArrowRight
                  size={20}
                  weight="regular"
                  color={`${theme.colors.purple['500']}`}
                />
              }
              ml={2}
            />
          </HStack>
        </Button>
      </HStack>
    </VStack>
  )
}
