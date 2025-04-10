'use client'

import { Providers } from '@/components/providers'

export default function Template({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
} 