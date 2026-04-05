'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  author_name: string
  likes: number
  views: number
  created_at: string
}

export default function PromptDetail({ params }: { params: { id: string } }) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPrompt()
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPrompt(data)

      await supabase
        .from('prompts')
        .update({ views: (data?.views || 0) + 1 })
        .eq('id', params.id)
    } catch (error) {
      console.error('Error fetching prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </main>
    )
  }

  if (!prompt) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">프롬프트를 찾을 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← 돌아가기
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{prompt.title}</h1>
              <p className="text-gray-600 mb-4">{prompt.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {prompt.category}
                </span>
                <span>by {prompt.author_name}</span>
                <span>👁️ {prompt.views}</span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">프롬프트 본문</h2>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
              >
                {copied ? '✓ 복사됨!' : '📋 복사하기'}
              </button>
            </div>
            <div className="bg-white p-4 rounded border border-gray-300 max-h-96 overflow-y-auto">
              <ReactMarkdown className="prose prose-sm max-w-none">
                {prompt.content}
              </ReactMarkdown>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/create"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold inline-block"
            >
              + 내 프롬프트 공유하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
