import { useAuth } from '@hooks/useAuth'
import { useEffect } from 'react'

export function SignOut() {
  const { handleSignOut } = useAuth()
  useEffect(() => {
    handleSignOut()
  }, [handleSignOut])

  return <></>
}
