import { createClient } from '@supabase/supabase-js'
import HomeClient, { type Prompt } from './HomeClient'

export const revalidate = 60

const PAGE_SIZE = 30

export default async function Home() {
  let prompts: Prompt[] = []
  let totalCount = 0
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, count } = await supabase
      .from('prompts')
      .select('id, title, description, category, author_name, views, likes, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE)
    prompts = data ?? []
    totalCount = count ?? 0
  } catch {
    // 빌드/갱신 중 Supabase 오류 시 빈 배열로 graceful 처리
  }

  return <HomeClient initialPrompts={prompts} initialCount={totalCount} />
}
