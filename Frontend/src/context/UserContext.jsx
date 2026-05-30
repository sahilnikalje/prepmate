import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../features/auth/services/authService'

//todo STEP-1: Create the context
const UserContext = createContext(null)

//todo STEP-2: Provider wraps the whole app — fetches user once and shares everywhere
export function UserProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe()
        setUser(data.user)
      } 
      catch (err) {
        //* Not logged in — user stays null
        setUser(null)
      } 
      finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  //todo STEP-3: clearUser called on logout
  const clearUser = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, loading, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

//todo STEP-4: Custom hook — use this in any component
export function useUser() {
  return useContext(UserContext)
}