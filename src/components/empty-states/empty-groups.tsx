import Link from 'next/link'
import { EmptyState } from '@/src/components/ui/empty-state'
import { Button } from '@/src/components/ui/button'

export function EmptyGroups() {
    return (
        <EmptyState
            icon="🏠"
            title="No groups yet"
            description="Create your first group to start tracking items in different spaces like Home or Office."
            action={
                <Link href="/groups/new">
                    <Button variant="primary">Create Group</Button>
                </Link>
            }
        />
    )
}
