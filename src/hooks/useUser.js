import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

export function useUser() {
  const { user } = useContext(UserContext)

  return user
}
