import { Inter } from 'next/font/google'
import './globals.css'
import { metadata } from './metadata'
import ClientLayout from './layout'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
} 