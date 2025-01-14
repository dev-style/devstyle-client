'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
// import { pageview } from '../lib/gtag'

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // pageview(pathname + searchParams.toString())
    }
  }, [pathname, searchParams])

  return null
}

export default function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
      {children}
    </>
  )
}