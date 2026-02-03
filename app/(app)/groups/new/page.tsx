import Link from 'next/link'
import { Card, CardContent } from '@/src/components/ui/card'
import { CreateGroupForm } from '@/src/components/groups/create-group-form'

export default function NewGroupPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to groups
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create a Group</h1>
        <p className="text-gray-500 text-center mb-6">
          Groups help you organize and share items with others.
        </p>

        <Card>
          <CardContent className="pt-6">
            <CreateGroupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
