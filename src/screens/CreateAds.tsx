import { Header } from '@components/Header'
import { ImageAds } from '@components/ImageAds'
import { AppError } from '@utils/AppError'
import {
  Button as ButtonNativeBase,
  Center,
  FlatList,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Switch,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { theme } from '@styles/default'
import { Plus, X } from 'phosphor-react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import * as Input from '@components/Input'
import { TextArea } from '@components/TextArea'
import { Radio } from '@components/Radio'
import { Checkbox } from '@components/Checkbox'
import { FooterButtons } from '@components/FooterButtons'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'
import { Button } from '@components/Button'
import { useProduct } from '../hooks/useProduct'
import { useAuth } from '@hooks/useAuth'

const PHOTO_SIZE = 32
const EDIT_SIZE = 6

const productSchema = zod.object({
  name: zod.string().min(1, { message: 'Informe o nome.' }),
  description: zod.string(),
  isNew: zod.string(),
  price: zod.string().regex(/^(\d{1,3}(.\d{3})*|\d+)(,\d+)?$/, {
    message: 'Informe um preço valido. 999,99',
  }),
  acceptTrade: zod.boolean(),
  paymentMethods: zod.string().array().nonempty(),
})

type productSchemaType = zod.infer<typeof productSchema>

export function CreateAds() {
  const [imageUploaded, setImageUploaded] = useState<string[]>([])
  const [imageUploadedFile, setImageUploadedFile] = useState<any[]>([])

  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<productSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      isNew: 'old',
      acceptTrade: false,
      paymentMethods: [],
    },
  })

  const navigation = useNavigation<AppNavigatorRoutesStackProps>()

  const toast = useToast()

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
            title: 'This Image is too big. Choose one smaller than 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = photo.split('.').pop()

        const photoFile = {
          name: `Product-profile.${fileExtension}`.toLowerCase(),
          uri: photo,
          type: `${imageSelected.assets[0].type}/${fileExtension}`,
        } as any

        setImageUploadedFile((state) => {
          return [...state, photoFile]
        })
        setImageUploaded((state) => {
          return [...state, photoFile.uri]
        })
      }
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível fazer upload de fotos.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  const { handleCreateNewPost } = useProduct()
  const { user } = useAuth()

  async function handleCreateAd(data: productSchemaType) {
    console.log(data)
    const { name, description, isNew, price, acceptTrade, paymentMethods } =
      data
    handleCreateNewPost(
      {
        id: '1-PROVISORY-ID-9',
        name,
        description,
        isNew: isNew === 'new',
        price: Number(price) * 100,
        acceptTrade,
        userId: user.id,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethods,
      },
      imageUploadedFile,
    )
    navigation.navigate('details', { postId: undefined })
  }

  return (
    <VStack px={6} flex={1} bg="gray.600">
      <Header title="Criar anúncio" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <form onSubmit={handleSubmit(handleCreateAd)}> */}
        <Text fontSize="md" color="gray.200" fontWeight="bold" mb={3}>
          Imagens
        </Text>
        <Text fontSize="xs" color="gray.300" mb={3}>
          Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
        </Text>
        <HStack mb={6} alignItems="flex-start">
          {imageUploaded?.length > 0 ? (
            <HStack justifyContent="flex-start">
              <FlatList // substituir o map -> ele renderiza apenas os elementos que cabem na tela
                data={imageUploaded}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <ImageAds
                        source={{ uri: item }}
                        alt="Image Uploaded"
                        size={PHOTO_SIZE}
                      />
                      <Center
                        mr={5}
                        marginLeft={-7}
                        marginTop={1}
                        w={EDIT_SIZE}
                        h={EDIT_SIZE}
                      >
                        <IconButton
                          icon={
                            <X
                              size={16}
                              weight="bold"
                              color={`${theme.colors.gray[700]}`}
                            />
                          }
                          onPress={() =>
                            setImageUploaded((state) => {
                              return state?.filter((s) => s !== item)
                            })
                          }
                          rounded="full"
                          size={EDIT_SIZE}
                          bg="gray.100"
                          _pressed={{
                            bg: 'purple.500',
                          }}
                        />
                      </Center>

                      {index === imageUploaded.length - 1 && (
                        <ButtonNativeBase
                          mr={20}
                          onPress={handleUserImageSelect}
                          bg="gray.500"
                          w={PHOTO_SIZE}
                          h={PHOTO_SIZE}
                          rounded="xl"
                        >
                          <Icon
                            as={
                              <Plus
                                size={64}
                                weight="bold"
                                color={`${theme.colors.gray[400]}`}
                              />
                            }
                            size={PHOTO_SIZE}
                            color="gray.100"
                          />
                        </ButtonNativeBase>
                      )}
                    </>
                  )
                }}
                showsVerticalScrollIndicator={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  imageUploaded.length === 0 && {
                    flex: 1,
                    justifyContent: 'center',
                  },
                ]}
              />
            </HStack>
          ) : (
            <ButtonNativeBase
              onPress={handleUserImageSelect}
              bg="gray.500"
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="xl"
            >
              <Icon
                as={
                  <Plus
                    size={64}
                    weight="bold"
                    color={`${theme.colors.gray[400]}`}
                  />
                }
                size={PHOTO_SIZE}
                color="gray.100"
              />
            </ButtonNativeBase>
          )}
        </HStack>

        <Text fontSize="md" color="gray.200" fontWeight="bold" mb={3}>
          Sobre o produto
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field }) => {
            return (
              <Input.Root errorMessage={errors.name?.message}>
                <Input.Input
                  placeholder="Título do anúncio"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              </Input.Root>
            )
          }}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => {
            return (
              <TextArea
                placeholder="Descrição do produto"
                onChangeText={field.onChange}
                value={field.value}
              />
            )
          }}
        />

        <Controller
          control={control}
          name="isNew"
          render={({ field }) => {
            return (
              <Radio
                mb={4}
                name="isNew"
                color="purple"
                accessibilityLabel="is new?"
                colorScheme="purple"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                defaultValue="old"
              />
            )
          }}
        />

        <Text fontSize="md" color="gray.200" fontWeight="bold" mb={3}>
          Venda
        </Text>

        <Controller
          control={control}
          name="price"
          render={({ field }) => {
            return (
              <Input.Root mb={3} errorMessage={errors.price?.message}>
                <Input.IconMoney />
                <Input.Input
                  placeholder="Valor do produto"
                  onChangeText={(value) =>
                    field.onChange(
                      value
                        .replace('.', '')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        .replace(/(,\d{2})\d+$/, '$1'),
                    )
                  }
                  value={field.value}
                />
              </Input.Root>
            )
          }}
        />

        <Text fontSize="md" color="gray.200" fontWeight="bold">
          Aceita Troca
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
                    console.log('newValues', newValues)
                    field.onChange(newValues)
                  }}
                  colorScheme="purple"
                />
              )
            }}
          />
        </HStack>
        <HStack mb={10}>
          <Button
            flex={1}
            onPress={() => navigation.navigate('home')}
            title="Cancelar"
            variant="gray"
            h={50}
            mr={2}
          />
          <Button
            ml={2}
            flex={1}
            onPress={handleSubmit(handleCreateAd)}
            title="Avançar"
            variant="purple"
            h={50}
          />
        </HStack>
      </ScrollView>
    </VStack>
  )
}
