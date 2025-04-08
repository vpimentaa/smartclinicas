import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/layout/client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartClínicas',
  description: 'Sistema de gestão para clínicas médicas',
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
