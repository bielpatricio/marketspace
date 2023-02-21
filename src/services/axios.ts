import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import { storageUserRemove } from '@storage/storageUser'
import { AppError } from '@utils/AppError'
import axios, { AxiosError, AxiosInstance } from 'axios'

type PromiseType = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

type SignOut = () => Promise<void>

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api: APIInstanceProps = axios.create({
  baseURL: 'http://192.168.0.30:3333',
  timeout: 5000,
}) as APIInstanceProps

async function handleSignOut() {
  // eslint-disable-next-line
  try {
    await storageUserRemove()
    await storageAuthTokenRemove()
  } catch (error) {
    throw error
  }
}

let isRefreshing = false
const failedQueue: Array<PromiseType> = []

const interceptTokenManager = api.interceptors.response.use(
  (response) => response,
  async (requestError) => {
    if (requestError?.response?.status === 401) {
      if (
        // requestError.response.data?.message === 'token.expired' ||
        // requestError.response.data?.message === 'token.invalid'
        requestError.response.data?.message !== 'JWT token não informado'
      ) {
        const { refreshToken } = await storageAuthTokenGet()

        if (!refreshToken) {
          handleSignOut()
          return Promise.reject(requestError)
        }

        const originalRequestConfig = requestError.config

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = {
                  Authorization: `Bearer ${token}`,
                }
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true

        // eslint-disable-next-line
        return new Promise(async (resolve, reject) => {
          try {
            console.log('dataaaaaaaaaa refreshToken', refreshToken)
            // 23942fe5-45ed-48e4-a518-e8b78b224afc
            const { data } = await api.post('/sessions/refresh-token', {
              refresh_token: refreshToken,
            })
            console.log('dataaaaaaaaaa', data)
            await storageAuthTokenSave({
              token: data.token,
              // refreshToken: data['refresh-token'],
              refreshToken: data.token,
            })

            if (originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(
                originalRequestConfig.data,
              )
            }

            api.defaults.headers.common.Authorization = `Bearer ${data.token}`
            console.log(
              'api.defaults.headers.common.Authorization',
              api.defaults.headers.common.Authorization,
            )
            originalRequestConfig.headers = {
              Authorization: `Bearer ${data.token}`,
            }

            failedQueue.forEach((request) => {
              request.onSuccess(data.token)
            })

            resolve(api(originalRequestConfig))
          } catch (error: any) {
            failedQueue.forEach((request) => {
              request.onFailure(error)
            })

            handleSignOut()
            reject(error)
          } finally {
            isRefreshing = false
          }
        })
      }
      console.log('outro error 401', requestError.response.data)
      handleSignOut()
    }

    if (requestError.response && requestError.response.data) {
      console.log('outro error', requestError.response.data)
      return Promise.reject(new AppError(requestError.response.data.message))
    } else {
      console.log('outro error requestError xxxxxxxxxxxx')
      return Promise.reject(requestError)
    }
  },
)

api.registerInterceptTokenManager = () => {
  console.log('outro error requestError vvvvvvvvv')
  // api.interceptors.response.use(
  //   (response) => response,
  //   async (requestError) => {
  //     console.log('outro error requestError ssssssssssss')
  //     if (requestError?.response?.status === 401) {
  //       if (
  //         requestError.response.data?.message === 'token.expired' ||
  //         requestError.response.data?.message === 'token.invalid'
  //       ) {
  //         const { refreshToken } = await storageAuthTokenGet()

  //         console.log('refreshToken', refreshToken)

  //         if (!refreshToken) {
  //           handleSignOut()
  //           return Promise.reject(requestError)
  //         }

  //         const originalRequestConfig = requestError.config
  //         console.log('refreshToken 2', originalRequestConfig)

  //         if (isRefreshing) {
  //           return new Promise((resolve, reject) => {
  //             failedQueue.push({
  //               onSuccess: (token: string) => {
  //                 originalRequestConfig.headers = {
  //                   Authorization: `Bearer ${token}`,
  //                 }
  //               },
  //               onFailure: (error: AxiosError) => {
  //                 reject(error)
  //               },
  //             })
  //           })
  //         }

  //         isRefreshing = true

  //         // eslint-disable-next-line
  //         return new Promise(async (resolve, reject) => {
  //           try {
  //             const { data } = await api.post('/sessions/refresh-token', {
  //               token: refreshToken,
  //             })
  //             await storageAuthTokenSave({
  //               token: data.token,
  //               // refreshToken: data['refresh-token'],
  //               refreshToken: data.token,
  //             })

  //             if (originalRequestConfig.data) {
  //               originalRequestConfig.data = JSON.parse(
  //                 originalRequestConfig.data,
  //               )
  //             }

  //             api.defaults.headers.common.Authorization = `Bearer ${data.token}`
  //             originalRequestConfig.headers = {
  //               Authorization: `Bearer ${data.token}`,
  //             }

  //             failedQueue.forEach((request) => {
  //               request.onSuccess(data.token)
  //             })

  //             resolve(api(originalRequestConfig))
  //           } catch (error: any) {
  //             failedQueue.forEach((request) => {
  //               request.onFailure(error)
  //             })

  //             handleSignOut()
  //             reject(error)
  //           } finally {
  //             isRefreshing = false
  //           }
  //         })
  //       }
  //       handleSignOut()
  //     }

  //     if (requestError.response && requestError.response.data) {
  //       console.log('outro error')
  //       return Promise.reject(new AppError(requestError.response.data.message))
  //     } else {
  //       console.log('outro error requestError xxxxxxxxxxxx')
  //       return Promise.reject(requestError)
  //     }
  //   },
  // )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
