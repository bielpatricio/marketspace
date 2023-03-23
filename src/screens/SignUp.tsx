import {
  Center,
  HStack,
  Heading,
  Button as ButtonNativeBase,
  ScrollView,
  Text,
  VStack,
  useToast,
  IconButton,
  Icon as IconNativeBase,
} from 'native-base'

import LogoSvg from '@assets/logo.svg'
import * as Input from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { Avatar } from '@components/Avatar'
import { User, PencilSimpleLine } from 'phosphor-react-native'
import { theme } from '@styles/default'
// import { useAuth } from '@hooks/useAuth'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/axios'
import { IconEye } from '../components/Input'

const PHOTO_SIZE = 32
const EDIT_SIZE = 14

type FormSignUp = {
  name: string
  email: string
  password: string
  confirmPassword: string
  tel: string
}

const phoneRegExp = /^\(\d{2}\)\s\d\s\d{4}-\d{4}$|^(\d{15})$/

const signUpSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Informe um nome.' }),
    email: zod
      .string()
      .min(1, { message: 'Informe um e-mail.' })
      .email('E-mail invalid.')
      .transform((value) => value.toLowerCase()),
    tel: zod
      .string()
      .min(11, { message: 'Informe um telefone.' })
      .max(16, {
        message:
          'Informe um telefone valido (max 15 caracteres). (xx) x xxxx-xxxx',
      })
      .regex(phoneRegExp, {
        message: 'Informe um telefone valido. xx xxxxx-xxxx',
      }),
    password: zod
      .string()
      .min(1, { message: 'Informe um password.' })
      .min(6, 'Minimum 6 characters.'),
    confirmPassword: zod.string().min(3, { message: 'Confirm the password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The password is different of confirm password!',
    path: ['confirmPassword'], // path of error
  })

type signUpSchemaType = zod.infer<typeof signUpSchema>

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const [isShowingPassword, setIsShowingPassword] = useState(true)
  const [isShowingConfirmPassword, setIsShowingConfirmPassword] = useState(true)

  const { handleSignIn } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      tel: '',
    },
  })

  const toast = useToast()

  const [avatar, setAvatar] = useState<string>()
  const [avatarFile, setAvatarFile] = useState<any>()

  async function handleSignUp(data: FormSignUp) {
    const { name, email, password, tel } = data

    const userForm = new FormData()
    userForm.append('avatar', avatarFile)
    userForm.append('name', name)
    userForm.append('tel', tel)
    userForm.append('email', email)
    userForm.append('password', password)

    try {
      setIsLoading(true)
      await api.post('/users', userForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await handleSignIn(email, password)
    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Error to create a new user. Try again later.'

      toast.show({
        title,
        placement: 'bottom',
        bgColor: 'red.500',
      })
    }
  }

  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  async function handleUserImageSelect() {
    setPhotoIsLoading(true)
    try {
      const imageSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        selectionLimit: 1,
      })

      if (imageSelected.canceled) {
        return
      }

      const photo = imageSelected.assets[0].uri

      if (photo) {
        const photoInfo = await FileSystem.getInfoAsync(photo)

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Esta imagem é muito grande. Escolha uma menor que 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = photo.split('.').pop()

        const photoFile = {
          name: `signUp-profile.${fileExtension}`.toLowerCase(),
          uri: photo,
          type: `${imageSelected.assets[0].type}/${fileExtension}`,
        } as any

        setAvatarFile(photoFile)
        setAvatar(photoFile.uri)

        // const userPhotoUploadForm = new FormData()
        // userPhotoUploadForm.append('avatar', photoFile)

        // console.log('userPhotoUploadForm', userPhotoUploadForm)

        // const responseAvatar = await api.patch(
        //   '/users/avatar',
        //   userPhotoUploadForm,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   },
        // )

        // const userUpdated = user
        // userUpdated.avatar = responseAvatar.data.avatar

        // await handleUpdateUserProfile(userUpdated)
      }
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível carregar a foto para o seu avatar.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleGoBackToSignIn() {
    // navigation.navigate('signIn')
    navigation.goBack()
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack px={10} flex={1} bg="gray.600" pb={16}>
        <Center mt={12} mb={6}>
          <LogoSvg />

          <Text color="gray.100" fontSize="lg" fontWeight="bold">
            Boas vindas!
          </Text>

          <Text color="gray.300" textAlign="center" fontSize="xs">
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </Center>
        <Center>
          <HStack mb={6} alignItems="flex-end">
            {avatar !== undefined && !photoIsLoading ? (
              <Avatar
                source={{ uri: avatar }}
                alt="User Avatar"
                size={PHOTO_SIZE}
              />
            ) : (
              <Center
                borderWidth={4}
                borderColor="purple.300"
                bg="gray.500"
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
              >
                <IconNativeBase
                  as={
                    <User
                      size={64}
                      weight="bold"
                      color={`${theme.colors.gray[400]}`}
                    />
                  }
                  size={PHOTO_SIZE}
                  color="gray.100"
                />
              </Center>
            )}

            <Center
              marginLeft={-12}
              bg="purple.300"
              w={EDIT_SIZE}
              h={EDIT_SIZE}
              rounded="full"
            >
              <IconButton
                icon={
                  <PencilSimpleLine
                    size={24}
                    weight="bold"
                    color={`${theme.colors.gray[600]}`}
                  />
                }
                size={EDIT_SIZE}
                color="gray.100"
                rounded="full"
                onPress={handleUserImageSelect}
                _pressed={{
                  bg: 'purple.500',
                }}
              />
            </Center>
          </HStack>

          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <Input.Root errorMessage={errors.name?.message}>
                  <Input.Input
                    placeholder="Nome"
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                </Input.Root>
              )
            }}
          />

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
            name="tel"
            render={({ field }) => {
              return (
                <Input.Root errorMessage={errors.tel?.message}>
                  <Input.Input
                    placeholder="Telefone"
                    onChangeText={(newValue) => {
                      field.onChange(
                        newValue
                          .replace(/\D/g, '') // remove tudo que não é número
                          .slice(0, 15) // limita em 15 caracteres
                          .replace(/^(\d{2})(\d)/g, '($1) $2') // formata (99)
                          .replace(/(\d{1})?(\d{4})(\d{4})$/, '$1 $2-$3'),
                      )
                    }}
                    value={field.value}
                  />
                </Input.Root>
              )
            }}
          />

          <HStack>
            <Controller
              control={control}
              name="password"
              render={({ field }) => {
                return (
                  <Input.Root errorMessage={errors.password?.message}>
                    <Input.Input
                      placeholder="password"
                      onChangeText={field.onChange}
                      value={field.value}
                      secureTextEntry={isShowingPassword}
                    />
                    <Input.IconEye
                      onPressIcon={() =>
                        setIsShowingPassword((state) => {
                          return !state
                        })
                      }
                    />
                  </Input.Root>
                )
              }}
            />
          </HStack>

          <HStack>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <Input.Root errorMessage={errors.confirmPassword?.message}>
                    <Input.Input
                      placeholder="Confirm password"
                      onChangeText={field.onChange}
                      value={field.value}
                      secureTextEntry={isShowingConfirmPassword}
                      onSubmitEditing={handleSubmit(handleSignUp)}
                      returnKeyType="send"
                    />
                    <Input.IconEye
                      onPressIcon={() =>
                        setIsShowingConfirmPassword((state) => {
                          return !state
                        })
                      }
                    />
                  </Input.Root>
                )
              }}
            />
          </HStack>

          <Button
            isLoading={isLoading}
            onPress={handleSubmit(handleSignUp)}
            title="Criar"
            variant="black"
            mt={4}
            h={50}
          />
        </Center>

        <Center pb={6} pt={8}>
          <Text color="gray.100" fontSize="sm" mb={2} fontFamily="body">
            Já tem uma conta?
          </Text>

          <Button
            onPress={handleGoBackToSignIn}
            mt={2}
            title="Ir para o login"
            variant="gray"
            h={50}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
