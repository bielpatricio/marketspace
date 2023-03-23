import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/axios'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type AuthContextDataProps = {
  user: UserDTO
  handleSignIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
  handleSignOut: () => Promise<void>
  handleUpdateUserProfile: (userUpdate: UserDTO) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextDataProps)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  // const [tokenX, setTokenX] = useState('')

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    console.log(
      'tokeeeeeeeeeeeenxxxxxxxxxxxxxxx',
      api.defaults.headers.common.Authorization,
    )
    setUser(userData)
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refreshToken: string,
  ) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave({ token, refreshToken })

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function handleSignIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token && data.refresh_token) {
        setIsLoadingUserStorageData(true)
        console.log(
          'data.user, data.token, data.refresh_token',
          data.user,
          data.token,
          data.refresh_token,
        )
        await userAndTokenUpdate(data.user, data.token)
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
      }

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function handleUpdateUserProfile(userUpdate: UserDTO) {
    // eslint-disable-next-line
    try {
      setUser(userUpdate)
      await storageUserSave(userUpdate)
    } catch (error) {
      throw error
    }
  }

  // async function handleSignOut() {
  const handleSignOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  // async function loadUserData() {
  const loadUserData = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      console.log('token && userLogged', token, userLogged)

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
      }
      // eslint-disable-next-line
    } catch (error) {
      console.log('error', error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const registerInterceptTokenManagerFunction = useCallback(async () => {
    // eslint-disable-next-line
    try {
      const subscribe = await api.registerInterceptTokenManager(handleSignOut)

      return async () => {
        await subscribe()
      }
    } catch (error) {
      throw error
    }
  }, [handleSignOut])

  useEffect(() => {
    registerInterceptTokenManagerFunction()
  }, [registerInterceptTokenManagerFunction])

  return (
    <AuthContext.Provider
      value={{
        user,
        handleSignIn,
        isLoadingUserStorageData,
        handleSignOut,
        handleUpdateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
