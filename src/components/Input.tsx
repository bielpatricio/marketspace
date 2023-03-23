import {
  FormControl,
  HStack,
  IFormControlProps,
  IInputProps,
  Icon,
  IconButton,
  Input as NativeBaseInput,
  Text,
} from 'native-base'
import { Eye, EyeSlash, MagnifyingGlass, Sliders } from 'phosphor-react-native'
import { ReactNode, useState } from 'react'

type RootProps = IFormControlProps & {
  children: ReactNode
  errorMessage?: string | null
}

export function Root({ children, errorMessage, ...rest }: RootProps) {
  const isInvalid = Boolean(errorMessage)

  return (
    <FormControl
      isInvalid={isInvalid}
      borderColor="gray.300"
      rounded="lg"
      mb={4}
      {...rest}
    >
      <HStack
        borderWidth={1}
        borderColor={isInvalid ? 'red.500' : 'gray.500'}
        alignItems="center"
        rounded="lg"
        bg="gray.700"
      >
        {children}
      </HStack>
      <FormControl.ErrorMessage _text={{ color: 'red.300' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}

export function IconMoney() {
  return (
    <Text ml={4} color="gray.100" fontSize="md">
      R${' '}
    </Text>
  )
}

type IconSearchProps = {
  onPressIcon: () => void
}

export function IconSearch({ onPressIcon }: IconSearchProps) {
  return (
    <HStack h="full" alignItems="center" backgroundColor="gray.700">
      <IconButton
        marginRight={2}
        onPress={onPressIcon}
        icon={
          <Icon as={MagnifyingGlass} width={24} height={24} color="gray.100" />
        }
      />
      <Text mt={-1} fontSize="sm" color="gray.100">
        |
      </Text>
      <IconButton
        marginRight={1}
        onPress={onPressIcon}
        icon={<Icon as={Sliders} width={24} height={24} color="gray.100" />}
      />
    </HStack>
  )
}

type IconEyeProps = {
  onPressIcon: () => void
}

export function IconEye({ onPressIcon }: IconEyeProps) {
  const [isShowingPassword, setIsShowingPassword] = useState(true)

  function handleIconPressed() {
    setIsShowingPassword((state) => !state)
    onPressIcon()
  }

  return (
    <IconButton
      marginRight={1}
      onPress={handleIconPressed}
      icon={
        <Icon
          as={isShowingPassword ? Eye : EyeSlash}
          width={24}
          height={24}
          color="gray.100"
        />
      }
    />
  )
}

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      flex={1}
      h={12}
      px={4}
      color="gray.100"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      placeholderTextColor="gray.400"
      rounded="lg"
      // isInvalid={invalid}
      _focus={{
        bg: 'gray.700',
      }}
      // onFocus={() => setBorderW(1)}
      {...rest}
    />
  )
}
