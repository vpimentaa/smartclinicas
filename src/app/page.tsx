'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function Home() {
  const router = useRouter()
  const { accountId, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (accountId) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [accountId, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return null
}
