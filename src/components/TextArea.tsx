import {
  FormControl,
  ITextAreaProps,
  TextArea as NativeBaseTextArea,
} from 'native-base'
import { useState } from 'react'

type TextAreaProps = ITextAreaProps & {
  size?: number
}

export function TextArea({ size = 32, ...rest }: TextAreaProps) {
  const [borderW, setBorderW] = useState(0)

  return (
    <FormControl
      borderWidth={borderW}
      borderColor="gray.300"
      rounded="lg"
      mb={4}
      bg="gray.700"
    >
      <NativeBaseTextArea
        autoCompleteType={true}
        flex={1}
        h={size}
        px={4}
        color="gray.100"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        placeholderTextColor="gray.400"
        rounded="lg"
        _focus={{
          bg: 'gray.700',
        }}
        onFocus={() => setBorderW(1)}
        {...rest}
      />
    </FormControl>
  )
}
