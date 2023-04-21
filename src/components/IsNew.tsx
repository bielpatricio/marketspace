import { Center, Text } from 'native-base'
import { ICenterProps } from 'native-base/lib/typescript/components/composites/Center/types'

type IsNewProps = ICenterProps & {
  isNew: boolean
}

export function IsNew({ isNew = false, ...rest }: IsNewProps) {
  // console.log('isNew', isNew)
  return (
    <Center
      {...rest}
      rounded="3xl"
      py={0.5}
      px={2}
      bg={isNew ? 'purple.500' : 'gray.300'}
    >
      <Text color={'gray.600'} fontSize={10} fontWeight="bold">
        {isNew ? 'NOVO' : 'USADO'}
      </Text>
    </Center>
  )
}
