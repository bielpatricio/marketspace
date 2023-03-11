import { theme } from '@styles/default'
import { Center, HStack, IButtonProps, Icon, Text, VStack } from 'native-base'
import { Plus, User } from 'phosphor-react-native'
import { Button } from './Button'
import { Avatar } from './Avatar'
import { useState } from 'react'
import { api } from '@services/axios'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesStackProps } from '@routes/app.routes'

type HomeHeaderType = {
  name: string
  avatar: string
}

export function HomeHeader({ name, avatar }: HomeHeaderType) {
  const navigation = useNavigation<AppNavigatorRoutesStackProps>()

  function handleGoCreateAds() {
    navigation.navigate('create')
  }

  return (
    <HStack flexWrap="wrap">
      <HStack flexWrap="wrap" w="1/2" alignItems="center">
        <Avatar
          size={14}
          source={{ uri: `${api.defaults.baseURL}/images/${avatar}` }}
          alt="User Avatar"
        />

        <VStack>
          <Text flexWrap="wrap" ml={2} fontSize="sm" color="gray.100">
            Boas vindas,{' '}
          </Text>
          <Text ml={2} fontWeight="bold" color="gray.100">
            {name}!
          </Text>
        </VStack>
      </HStack>

      <HStack flexWrap="wrap" w="1/2" alignItems="center">
        <Button
          onPress={handleGoCreateAds}
          icon={
            <Plus size={20} weight="bold" color={`${theme.colors.gray[700]}`} />
          }
          title={`Criar anúncio`}
          variant="black"
          mt={4}
          h={50}
        />
      </HStack>
    </HStack>
  )
}
