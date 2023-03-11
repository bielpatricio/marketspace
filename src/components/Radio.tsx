import {
  Center,
  HStack,
  IRadioGroupProps,
  IRadioProps,
  Radio as RadioNativeBase,
} from 'native-base'
import { useState } from 'react'

type RadioNativeBaseProps = IRadioGroupProps & {}

export function Radio({ ...rest }: RadioNativeBaseProps) {
  return (
    <RadioNativeBase.Group {...rest}>
      <HStack>
        <RadioNativeBase value="new" mx={1}>
          Produto novo
        </RadioNativeBase>
        <Center px={2}>
          <RadioNativeBase value="old" mx={1}>
            Produto usado
          </RadioNativeBase>
        </Center>
      </HStack>
    </RadioNativeBase.Group>
  )
}
