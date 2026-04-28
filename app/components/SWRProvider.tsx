'use client'
import { SWRConfig } from 'swr'
import { useEffect, useState } from 'react'

function localStorageProvider() {
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem('pl-swr-cache') || '[]')
  )
  window.addEventListener('beforeunload', () => {
    const cache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('pl-swr-cache', cache)
  })
  return map
}

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <>{children}</>
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      {children}
    </SWRConfig>
  )
}
