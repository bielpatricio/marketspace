import { StatusBar } from 'react-native'
import { theme } from './src/styles/themes/default'
import {
  useFonts,
  // eslint-disable-next-line
  Karla_400Regular,
  // eslint-disable-next-line
  Karla_700Bold,
} from '@expo-google-fonts/karla'
import { Loading } from '@components/Loading'
import { Routes } from './src/routes/index'
import { NativeBaseProvider } from 'native-base'
import { AuthContextProvider } from '@contexts/AuthContext'
import { ProductContextProvider } from '@contexts/ProductContext'

export default function App() {
  // eslint-disable-next-line
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })

  return (
    <NativeBaseProvider theme={theme}>
      <AuthContextProvider>
        <ProductContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </ProductContextProvider>
      </AuthContextProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
    </NativeBaseProvider>
  )
}
