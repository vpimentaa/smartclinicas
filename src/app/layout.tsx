import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { TopMenu } from '@/components/layout/TopMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartClínicas',
  description: 'Sistema de gestão para clínicas e consultórios médicos',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SupabaseProvider>
          <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
              <TopMenu />
              <main className="flex-1 overflow-y-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}
