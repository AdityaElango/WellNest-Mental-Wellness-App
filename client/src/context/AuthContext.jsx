import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const TOKEN_KEY = 'wellnest_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login: (nextToken) => {
        localStorage.setItem(TOKEN_KEY, nextToken)
        setToken(nextToken)
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      },
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
