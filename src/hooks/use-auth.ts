import { useContext } from 'react'
import { SupabaseContext } from '@/contexts/SupabaseContext'

export function useAuth() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error('useAuth must be used within a SupabaseProvider')
  }

  return context
}