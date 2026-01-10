import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/Workflows"
import { prefetchWorkflows } from "@/features/workflows/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


const page = async () => {
  await requireAuth()

  prefetchWorkflows()
  
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading</p>}>
          <WorkflowsList />
        </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  )
}

export default page