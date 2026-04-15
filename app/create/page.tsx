import CreatePromptForm from '@/app/components/CreatePromptForm'

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <CreatePromptForm />
      </div>
    </main>
  )
}