import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

// Infer Input Type for TRPC Procedure
type Input = inferInput<typeof trpc.workflows.getMany>


// Prefetch all workflows
export const prefetchWorkflows = (params: Input) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params))
}