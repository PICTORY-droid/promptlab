import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-blue-600 tracking-tighter hover:text-blue-700 transition-colors">
          PromptShare
        </Link>
        <Link
          href="/create"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold transition-all active:scale-95 shadow-sm"
        >
          + 프롬프트 공유
        </Link>
      </div>
    </nav>
  )
}
