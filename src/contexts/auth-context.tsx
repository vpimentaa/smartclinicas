'use client'

import { createContext, ReactNode, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  clinicName: string
  role: 'owner' | 'admin' | 'employee'
}

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, clinicName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          clinicName: session.user.user_metadata.clinic_name,
          role: session.user.user_metadata.role || 'owner',
        })
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          clinicName: session.user.user_metadata.clinic_name,
          role: session.user.user_metadata.role || 'owner',
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return null // or a loading spinner
  }

  async function signUp(email: string, password: string, clinicName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            clinic_name: clinicName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          clinicName: data.user.user_metadata.clinic_name,
          role: data.user.user_metadata.role || 'owner',
        })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          clinicName: data.user.user_metadata.clinic_name,
          role: data.user.user_metadata.role || 'owner',
        })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 