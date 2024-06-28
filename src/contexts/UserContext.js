import { createContext, useEffect, useState } from 'react'
import { USER_POSSIBLE_STATES } from '../utils/user-possible-states'
import { onAuthStateChanged } from '../firebase/auth'

export const UserContext = createContext(USER_POSSIBLE_STATES.NOT_KNOWN)

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(USER_POSSIBLE_STATES.NOT_KNOWN)

  useEffect(() => {
    onAuthStateChanged(setUser)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
