'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function Header() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-semibold text-gray-900">SmartClínicas</h1>
            </div>
            <nav className="ml-6 flex space-x-8">
              <a
                href="/dashboard"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Dashboard
              </a>
              <a
                href="/cadastro-profissionais"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Profissionais
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSignOut}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 