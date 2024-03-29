import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import {
  Heading,
  Center,
  IconButton,
  Icon,
  HStack,
  Text,
  VStack,
  IHeadingProps,
  ITextProps,
  IButtonProps,
  IIconButtonProps,
} from 'native-base'
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack'
import { ArrowLeft, PencilSimpleLine, Plus } from 'phosphor-react-native'
import { ReactNode } from 'react'

type RootProps = IHStackProps & {
  children: ReactNode
}

export function Root({ children, ...rest }: RootProps) {
  return (
    <HStack
      {...rest}
      alignItems="center"
      justifyContent="space-between"
      pb={6}
      pt={16}
    >
      {children}
    </HStack>
  )
}

type TitleProps = ITextProps & {
  title: string
  subtitle?: string
}

export function Title({ title, subtitle, ...rest }: TitleProps) {
  return (
    <VStack justifyContent="center">
      <Text
        {...rest}
        textAlign="center"
        fontSize="md"
        fontFamily="heading"
        fontWeight="bold"
        mb={1}
      >
        {title}
      </Text>
      {Boolean(subtitle) && (
        <Text {...rest} textAlign="center" fontSize="sm">
          {subtitle}
        </Text>
      )}
    </VStack>
  )
}

type ButtonProps = IIconButtonProps

export function BackButton({ ...rest }: ButtonProps) {
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }
  return (
    <IconButton
      {...rest}
      marginRight={1}
      onPress={handleGoBack}
      icon={<Icon as={ArrowLeft} width={24} height={24} color="gray.100" />}
    />
  )
}

export function EditButton({ ...rest }: ButtonProps) {
  return (
    <IconButton
      {...rest}
      marginRight={1}
      icon={
        <Icon as={PencilSimpleLine} width={24} height={24} color="gray.100" />
      }
    />
  )
}

export function PlusButton({ ...rest }: ButtonProps) {
  const navigation = useNavigation<AppNavigatorRoutesStackProps>()

  function handleCreate() {
    navigation.navigate('create', {
      postId: undefined,
    })
  }

  return (
    <IconButton
      {...rest}
      marginRight={1}
      onPress={handleCreate}
      icon={<Icon as={Plus} width={24} height={24} color="gray.100" />}
    />
  )
}
