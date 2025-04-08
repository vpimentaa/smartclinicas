'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Header } from './header'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { accountId, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !accountId) {
      router.push('/login')
    }
  }, [accountId, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!accountId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
} 