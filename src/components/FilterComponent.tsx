import {
  HStack,
  Modal,
  Switch,
  Text,
  VStack,
  Button as ButtonBase,
  Icon,
  Center,
} from 'native-base'
import { theme } from '@styles/default'
import * as Input from './Input'
import { useState } from 'react'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import { useForm, Controller } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { X } from 'phosphor-react-native'
import { useProduct } from '@hooks/useProduct'

const filterSchema = zod.object({
  isNew: zod.boolean().optional(),
  isNotNew: zod.boolean().optional(),
  acceptTrade: zod.boolean().optional(),
  paymentMethods: zod.string().array().optional(),
})

type filterSchemaType = zod.infer<typeof filterSchema>

export function FilterComponent() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const [query, setQuery] = useState('')

  const { control, handleSubmit, reset, getValues } = useForm<filterSchemaType>(
    {
      resolver: zodResolver(filterSchema),
      defaultValues: {
        isNew: false,
        isNotNew: false,
        acceptTrade: false,
        paymentMethods: [],
      },
    },
  )

  const { getAllProductRegistered } = useProduct()

  async function resetFilter() {
    await getAllProductRegistered({})
    reset()
  }

  async function submitFilter(data: filterSchemaType) {
    console.log('ueee')
    const dataToSend = {
      isNew: data.isNew === data.isNotNew ? null : !!data.isNew,
      acceptTrade: data.acceptTrade,
      paymentMethods: data.paymentMethods,
      query: '',
    }
    await getAllProductRegistered(dataToSend)
    setIsOpenModal(false)
  }

  async function searchByText() {
    console.log(query)
    const data = {
      isNew: getValues('isNew'),
      isNotNew: getValues('isNotNew'),
      acceptTrade: getValues('acceptTrade'),
      paymentMethods: getValues('paymentMethods'),
    }
    const dataToSend = {
      isNew: data.isNew === data.isNotNew ? null : !!data.isNew,
      acceptTrade: data.acceptTrade,
      paymentMethods: data.paymentMethods,
      query,
    }
    await getAllProductRegistered(dataToSend)
  }

  return (
    <VStack my={5}>
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        avoidKeyboard
        justifyContent="flex-end"
        bottom="0"
        size="full"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Filtrar anúncios</Modal.Header>
          <Modal.Body>
            <VStack>
              <Text fontSize="md" color="gray.200" fontWeight="bold">
                Condição
              </Text>
              <HStack mb={3} w="full">
                <HStack mr={2}>
                  <Controller
                    control={control}
                    name="isNew"
                    render={({ field }) => {
                      return (
                        <ButtonBase
                          onPress={() => field.onChange(!field.value)}
                          py={0}
                          m={0}
                          endIcon={
                            field.value ? (
                              <Center
                                w={4}
                                h={4}
                                bgColor="gray.700"
                                rounded="full"
                              >
                                <X
                                  size={10}
                                  weight="bold"
                                  color={`${theme.colors.purple[300]}`}
                                />
                              </Center>
                            ) : undefined
                          }
                          rounded="full"
                          bgColor={field.value ? 'purple.300' : 'gray.400'}
                        >
                          <Text
                            color={field.value ? 'gray.700' : 'gray.100'}
                            fontSize="xs"
                          >
                            NOVO
                          </Text>
                        </ButtonBase>
                      )
                    }}
                  />
                </HStack>
                <HStack ml={2}>
                  <Controller
                    control={control}
                    name="isNotNew"
                    render={({ field }) => {
                      return (
                        <ButtonBase
                          rounded="full"
                          onPress={() => field.onChange(!field.value)}
                          py={1}
                          px={3}
                          m={0}
                          endIcon={
                            field.value ? (
                              <Center
                                w={4}
                                h={4}
                                bgColor="gray.700"
                                rounded="full"
                              >
                                <X
                                  size={10}
                                  weight="bold"
                                  color={`${theme.colors.purple[300]}`}
                                />
                              </Center>
                            ) : undefined
                          }
                          bgColor={field.value ? 'purple.300' : 'gray.400'}
                        >
                          <Text
                            color={field.value ? 'gray.700' : 'gray.100'}
                            fontSize="xs"
                          >
                            USADO
                          </Text>
                        </ButtonBase>
                      )
                    }}
                  />
                </HStack>
              </HStack>

              <Text fontSize="md" color="gray.200" fontWeight="bold">
                Aceita Troca?
              </Text>
              <HStack mb={3}>
                <Controller
                  control={control}
                  name="acceptTrade"
                  render={({ field }) => {
                    return (
                      <Switch
                        name="acceptTrade"
                        size="lg"
                        isChecked={field.value}
                        onToggle={(newValue) => {
                          field.onChange(newValue)
                        }}
                        onTrackColor="purple.300"
                      />
                    )
                  }}
                />
              </HStack>

              <Text fontSize="md" color="gray.200" fontWeight="bold" mb={3}>
                Meios de pagamento aceitos
              </Text>

              <HStack mb={3}>
                <Controller
                  control={control}
                  name="paymentMethods"
                  rules={{
                    required: 'Selecione pelo menos uma forma de pagamento',
                  }}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        defaultValue={[]}
                        value={field.value}
                        onChange={(newValues) => {
                          field.onChange(newValues)
                        }}
                        colorScheme="purple"
                      />
                    )
                  }}
                />
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <HStack w="full">
              <Button
                flex={1}
                onPress={resetFilter}
                title="Resetar filtros"
                variant="gray"
                h={50}
                mr={2}
              />
              <Button
                ml={2}
                flex={1}
                onPress={handleSubmit(submitFilter)}
                title="Aplicar filtros"
                variant={'black'}
                h={50}
              />
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Text fontSize="sm" color="gray.300" mb={3}>
        Compre produtos variados
      </Text>
      <Input.Root>
        <Input.Input
          returnKeyType="search"
          onChange={(e) => setQuery(e.nativeEvent.text)}
          value={query}
          placeholder="Buscar anúncio"
        />
        <Input.IconSearch
          onPressIconSearch={searchByText}
          onPressIconFilter={() => setIsOpenModal(true)}
        />
      </Input.Root>
    </VStack>
  )
}
