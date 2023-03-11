import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import { House, SignOut as SignOutPhosphor } from 'phosphor-react-native'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { Home } from '@screens/Home'
import { SignOut } from '@components/SignOut'
import { CreateAds } from '@screens/CreateAds'
import { Details } from '@screens/Details'

type AppRoutesTabType = {
  home: undefined
  signOut: undefined
}

type AppRoutesStackType = {
  home: undefined
  details: {
    postId: string | undefined
  }
  create: undefined
}

export type AppNavigatorRoutesTabProps =
  BottomTabNavigationProp<AppRoutesTabType>
export type AppNavigatorRoutesStackProps =
  NativeStackNavigationProp<AppRoutesStackType>

const Tab = createBottomTabNavigator<AppRoutesTabType>()
const Stack = createNativeStackNavigator<AppRoutesStackType>()

function HomeTabs() {
  const { sizes, colors } = useTheme()
  const iconSize = sizes[8]

  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House weight="bold" size={iconSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="signOut"
        component={SignOut}
        options={{
          tabBarIcon: ({ color }) => (
            <SignOutPhosphor size={iconSize} color={colors.red[300]} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="home"
        component={HomeTabs}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="create"
        component={CreateAds}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="details"
        component={Details}
      />
    </Stack.Navigator>
  )
}
