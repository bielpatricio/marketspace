import {
  Checkbox as CheckboxNativeBase,
  ICheckboxGroupProps,
} from 'native-base'

export function Checkbox({ ...rest }: ICheckboxGroupProps) {
  return (
    <CheckboxNativeBase.Group colorScheme="purple" {...rest}>
      <CheckboxNativeBase size="sm" value="pix" my={2}>
        Pix
      </CheckboxNativeBase>
      <CheckboxNativeBase size="sm" value="boleto" my={2}>
        Boleto
      </CheckboxNativeBase>
      <CheckboxNativeBase size="sm" value="cash" my={2}>
        Dinheiro
      </CheckboxNativeBase>
      <CheckboxNativeBase size="sm" value="card" my={2}>
        Cartão de Crédito
      </CheckboxNativeBase>
      <CheckboxNativeBase size="sm" value="deposit" my={2}>
        Depósito Bancário
      </CheckboxNativeBase>
    </CheckboxNativeBase.Group>
  )
}
