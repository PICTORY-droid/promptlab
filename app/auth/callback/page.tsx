'use client'

import { useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase SDK는 createClient 시점에 initialize()를 자동 실행하고
    // URL의 code(PKCE) 또는 access_token(Implicit)을 자동으로 처리하여 세션을 localStorage에 저장함
    // exchangeCodeForSession을 별도 호출하면 일회용 code를 중복 사용하여 실패함
    // initialize() 완료를 기다린 후 redirect만 수행
    supabase.auth.initialize().then(() => {
      router.replace('/')
    })
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
      <div className="font-mono text-lg" style={{ color: '#58a6ff' }}>
        <span style={{ color: '#3fb950' }}>$</span> authenticating<span className="blink">_</span>
      </div>
    </main>
  )
}
