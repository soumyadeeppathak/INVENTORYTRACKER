import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { AcceptInviteForm } from '@/src/components/invites/accept-invite-form'

interface InvitePageProps {
    params: Promise<{ token: string }>
}

async function getInviteDetails(token: string) {
    const invite = await db.groupInvite.findUnique({
        where: { token },
        include: {
            group: true,
        },
    })

    if (!invite) {
        return null
    }

    // Check if expired
    if (new Date() > invite.expiresAt) {
        return { expired: true, group: invite.group }
    }

    // Check if already accepted
    if (invite.acceptedAt) {
        return { accepted: true, group: invite.group }
    }

    return {
        valid: true,
        group: invite.group,
        email: invite.email,
    }
}

export default async function InvitePage({ params }: InvitePageProps) {
    const { token } = await params
    const currentUser = await getCurrentUser()

    const inviteDetails = await getInviteDetails(token)

    if (!inviteDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
                    <p className="text-gray-600 mb-6">This invite link is invalid or has been removed.</p>
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        )
    }

    if (inviteDetails.expired) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">⏰</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Expired</h1>
                    <p className="text-gray-600 mb-6">
                        This invite to <strong className="text-gray-900">{inviteDetails.group.name}</strong> has expired.
                        Please ask the group owner to send a new invite.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        )
    }

    if (inviteDetails.accepted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Accepted</h1>
                    <p className="text-gray-600 mb-6">This invite has already been used.</p>
                    <a
                        href={`/groups/${inviteDetails.group.id}`}
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go to {inviteDetails.group.name}
                    </a>
                </div>
            </div>
        )
    }

    // Valid invite
    if (!currentUser) {
        // Not logged in - redirect to login with callback
        const callbackUrl = encodeURIComponent(`/invite/${token}`)
        redirect(`/login?callbackUrl=${callbackUrl}`)
    }

    // User is logged in - show accept form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">{inviteDetails.group.emoji}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Invited!</h1>
                <p className="text-gray-600 mb-6">
                    You've been invited to join <strong className="text-gray-900">{inviteDetails.group.name}</strong>
                </p>
                <AcceptInviteForm token={token} groupName={inviteDetails.group.name} />
            </div>
        </div>
    )
}
