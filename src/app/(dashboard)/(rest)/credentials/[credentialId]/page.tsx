import { CredentialView } from "@/features/credentials/components/Credential"
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/Credentials"
import { prefetchCredential } from "@/features/credentials/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface PageProps {
    params: Promise<{
        credentialId: string
    }>
}


const page = async ({ params }: PageProps) => {
    await requireAuth()

    const { credentialId } = await params
    prefetchCredential(credentialId)

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-3xl w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<CredentialsError />}>
                    <Suspense fallback={<CredentialsLoading />}>
                        <CredentialView credentialId={credentialId} />
                    </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
}

export default page