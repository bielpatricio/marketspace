import { useNavigation } from '@react-navigation/native'
import {
  Heading,
  Center,
  IconButton,
  Icon,
  HStack,
  Text,
  VStack,
} from 'native-base'
import { ArrowLeft, PencilSimpleLine } from 'phosphor-react-native'

type HeaderProps = {
  title: string
  subtitle?: string
  backIcon?: boolean
  editIcon?: boolean
}

export function Header({
  title,
  backIcon = true,
  editIcon = false,
  subtitle = undefined,
}: HeaderProps) {
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack
      justifyContent="space-between"
      bgColor={subtitle ? 'purple.300' : 'transparent'}
      pb={6}
      pt={16}
    >
      {backIcon ? (
        <IconButton
          marginRight={1}
          onPress={handleGoBack}
          icon={<Icon as={ArrowLeft} width={24} height={24} color="gray.100" />}
        />
      ) : (
        <HStack width={12}></HStack>
      )}

      <VStack justifyContent="center">
        <Heading
          textAlign="center"
          color={subtitle ? 'gray.600' : 'gray.100'}
          fontSize="md"
          fontFamily="heading"
          mb={1}
        >
          {title}
        </Heading>
        {Boolean(subtitle) && (
          <Text
            textAlign="center"
            color={subtitle ? 'gray.600' : 'gray.100'}
            fontSize="sm"
          >
            {subtitle}
          </Text>
        )}
      </VStack>

      {editIcon ? (
        <IconButton
          marginRight={1}
          onPress={handleGoBack}
          icon={
            <Icon
              as={PencilSimpleLine}
              width={24}
              height={24}
              color="gray.100"
            />
          }
        />
      ) : (
        <HStack width={12}></HStack>
      )}
    </HStack>
  )
}
