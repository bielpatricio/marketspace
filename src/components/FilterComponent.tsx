import { Text, VStack } from 'native-base'
import { Input } from './Input'

export function FilterComponent() {
  return (
    <VStack my={5}>
      <Text fontSize="sm" color="gray.300" mb={3}>
        Compre produtos variados
      </Text>

      <Input
        _focus={{
          bg: 'gray.700',
          borderWidth: 0,
        }}
        returnKeyType="search"
        placeholder="Buscar anúncio"
        icon="Search"
      />
    </VStack>
  )
}
