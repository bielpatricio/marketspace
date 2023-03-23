import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'

import LogoSvg from '@assets/logo.svg'
import * as Input from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

type FormSignIn = {
  email: string
  password: string
}

const signInSchema = zod.object({
  email: zod
    .string()
    .min(3, { message: 'Informe seu e-mail.' })
    .email('E-mail invalido.'),
  password: zod
    .string()
    .min(3, { message: 'Inform a password.' })
    .min(6, 'Minimum 6 characters.'),
})

type signInSchemaType = zod.infer<typeof signInSchema>

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoToSignUp() {
    navigation.navigate('signUp')
  }

  const { handleSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const toast = useToast()

  async function handleFormSignIn({ email, password }: FormSignIn) {
    try {
      setIsLoading(true)
      await handleSignIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Error login. Try again later.'

      setIsLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.700">
        <Center pb={16} px={10} flex={1} rounded="3xl" bg="gray.600">
          <Center mt={24} mb={12}>
            <LogoSvg />

            <Text color="gray.100" fontSize="xl" fontWeight="bold">
              marketspace
            </Text>

            <Text color="gray.300" fontSize="sm">
              Seu espaço de compra e venda
            </Text>
          </Center>
          <Center w="full">
            <Heading color="gray.100" fontSize="md" mb={6} fontFamily="bold">
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <Input.Root errorMessage={errors.email?.message}>
                    <Input.Input
                      placeholder="e-mail"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={field.onChange}
                      value={field.value}
                    />
                  </Input.Root>
                )
              }}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => {
                return (
                  <Input.Root errorMessage={errors.password?.message}>
                    <Input.Input
                      placeholder="Senha"
                      onChangeText={field.onChange}
                      value={field.value}
                      onSubmitEditing={handleSubmit(handleFormSignIn)}
                      returnKeyType="send"
                      secureTextEntry={showPassword}
                    />
                    <Input.IconEye
                      onPressIcon={() =>
                        setShowPassword((state) => {
                          return !state
                        })
                      }
                    />
                  </Input.Root>
                )
              }}
            />

            <Button
              onPress={handleSubmit(handleFormSignIn)}
              title="Entrar"
              variant="purple"
              isLoading={isLoading}
            />
          </Center>
        </Center>

        <Center bg="gray.700" pb={12} pt={10} px={10}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            onPress={handleGoToSignUp}
            title="Criar uma conta"
            variant="gray"
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
