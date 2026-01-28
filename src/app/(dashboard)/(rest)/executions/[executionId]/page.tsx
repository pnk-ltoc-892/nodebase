import { prefetchExecution } from "@/features/executions-history/server/prefetch"
import { ExecutionView } from "@/features/executions-history/components/Execution"
import { ExecutionsError, ExecutionsLoading } from "@/features/executions-history/components/Executions"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface PageProps {
    params: Promise<{
        executionId: string
    }>
}


const page = async ({ params }: PageProps) => {
    await requireAuth()

    const { executionId } = await params
    prefetchExecution(executionId)

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-3xl w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<ExecutionsError />}>
                        <Suspense fallback={<ExecutionsLoading />}>
                            <ExecutionView executionId={executionId} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
}

export default page