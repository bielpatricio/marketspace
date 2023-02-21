import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs/lib/typescript/src/types'

import { House, SignOut as SignOutPhosphor } from 'phosphor-react-native'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { theme } from '@styles/default'
import { Home } from '@screens/Home'
import { SignOut } from '@components/SignOut'

type AppRoutesType = {
  home: undefined
  signOut: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()
  const iconSize = sizes[8]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.purple[300],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House weight="bold" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="signOut"
        component={SignOut}
        options={{
          tabBarIcon: ({ color }) => (
            <SignOutPhosphor size={iconSize} color={colors.red[300]} />
          ),
        }}
      />

      {/* <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      /> */}
    </Navigator>
  )
}
