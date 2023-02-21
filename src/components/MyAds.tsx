import { theme } from '@styles/default'
import { Button, HStack, Icon, Text, VStack } from 'native-base'
import { ArrowRight, Tag } from 'phosphor-react-native'

export function MyAds() {
  return (
    <VStack flex={1} mt={10}>
      <Text fontSize="sm" color="gray.300" mb={3}>
        Seus produtos anunciados para venda
      </Text>

      <HStack
        justifyContent="space-between"
        py={5}
        pr={1}
        pl={3}
        alignItems="flex-start"
        rounded="lg"
        background="purple.300:alpha.10"
      >
        <HStack alignItems="center" w="1/2">
          <Icon
            as={
              <Tag
                size={32}
                weight="bold"
                color={`${theme.colors.purple['500']}`}
              />
            }
            mr={3}
          />
          <VStack justifyContent="center">
            <Text
              textAlign="center"
              fontSize="md"
              fontWeight="bold"
              color="gray.300"
            >
              4
            </Text>
            <Text fontSize="sm" color="gray.300">
              anúncios ativos
            </Text>
          </VStack>
        </HStack>

        <Button bg="transparent" w="1/2">
          <HStack alignItems="center">
            <Text fontSize="sm" color="purple.500">
              Meus anúncios
            </Text>
            <Icon
              as={
                <ArrowRight
                  size={20}
                  weight="bold"
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
