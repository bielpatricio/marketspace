import { Text, VStack } from 'native-base'
import * as Input from './Input'

export function FilterComponent() {
  return (
    <VStack my={5}>
      <Text fontSize="sm" color="gray.300" mb={3}>
        Compre produtos variados
      </Text>
      <Input.Root>
        <Input.Input returnKeyType="search" placeholder="Buscar anúncio" />
        <Input.IconSearch onPressIcon={() => {}} />
      </Input.Root>
    </VStack>
  )
}
