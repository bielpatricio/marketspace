import {
  FormControl,
  HStack,
  IInputProps,
  Icon,
  IconButton,
  Input as NativeBaseInput,
  Text,
} from 'native-base'
import { Eye, EyeSlash, MagnifyingGlass, Sliders } from 'phosphor-react-native'
import { useState } from 'react'

type InputProps = IInputProps & {
  errorMessage?: string | null
  icon?: 'Eye' | 'EyeSlash' | 'Money' | 'Search' | null
  onPressIcon?: () => void
}

export function Input({
  errorMessage = null,
  icon = null,
  isInvalid,
  onPressIcon,
  ...rest
}: InputProps) {
  const invalid = !!errorMessage || isInvalid

  const [borderW, setBorderW] = useState(0)

  return (
    <FormControl
      isInvalid={invalid}
      borderWidth={borderW}
      borderColor="gray.300"
      rounded="lg"
      mb={4}
      bg="purple.700"
    >
      <HStack rounded="lg" flex={1} bg="gray.700">
        {icon === 'Money' && (
          <Text color="gray.100" fontSize="md">
            R${' '}
          </Text>
        )}

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
          isInvalid={invalid}
          _focus={{
            bg: 'gray.700',
          }}
          onFocus={() => setBorderW(1)}
          {...rest}
        />

        {(icon === 'Eye' || icon === 'EyeSlash') && (
          <IconButton
            marginRight={1}
            onPress={onPressIcon}
            icon={
              <Icon
                as={icon === 'Eye' ? Eye : EyeSlash}
                width={24}
                height={24}
                color="gray.100"
              />
            }
          />
        )}
        {icon === 'Search' && (
          <HStack h="full" alignItems="center" backgroundColor="gray.700">
            <IconButton
              marginRight={2}
              onPress={onPressIcon}
              icon={
                <Icon
                  as={MagnifyingGlass}
                  width={24}
                  height={24}
                  color="gray.100"
                />
              }
            />
            <Text mt={-1} fontSize="sm" color="gray.100">
              |
            </Text>
            <IconButton
              marginRight={1}
              onPress={onPressIcon}
              icon={
                <Icon as={Sliders} width={24} height={24} color="gray.100" />
              }
            />
          </HStack>
        )}
      </HStack>
      <FormControl.ErrorMessage _text={{ color: 'red.300' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
