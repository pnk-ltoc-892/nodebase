import { executionsParamsLoader } from "@/features/executions-history/server/params-loader"
import { prefetchExecutions } from "@/features/executions-history/server/prefetch"
import { ExecutionsContainer, ExecutionsError, ExecutionsList, ExecutionsLoading } from "@/features/executions-history/components/Executions"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { SearchParams } from "nuqs"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


type Props = {
    searchParams: Promise<SearchParams>
}

const page = async ({ searchParams }: Props) => {
    await requireAuth()

    const params = await executionsParamsLoader(searchParams)
    prefetchExecutions(params)

    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ExecutionsError />}>
                    <Suspense fallback={<ExecutionsLoading />}>
                        <ExecutionsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    )
}

export default page