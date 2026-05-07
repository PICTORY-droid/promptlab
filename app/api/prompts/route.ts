import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const PAGE_SIZE = 30

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category') || 'All'
  const q = (searchParams.get('q') || '').trim()
  const sort = searchParams.get('sort') || 'latest'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let query = supabase
      .from('prompts')
      .select('id, title, description, category, author_name, views, likes, created_at', { count: 'exact' })

    if (category !== 'All') query = query.eq('category', category)
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,author_name.ilike.%${q}%`)

    query = query
      .order(sort === 'popular' ? 'views' : 'created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    const { data, count, error } = await query

    if (error) return NextResponse.json({ data: [], count: 0 }, { status: 500 })
    return NextResponse.json({ data: data ?? [], count: count ?? 0 })
  } catch {
    return NextResponse.json({ data: [], count: 0 }, { status: 500 })
  }
}
