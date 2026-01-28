import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useExecutionsParams } from "./use-executions-params"


// Hook to fetch all Executions using suspense
export const useSuspenseExecutions = () => {
    const trpc = useTRPC()
    const [params] = useExecutionsParams()

    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params))
}

// Hook to fetch single credential using suspense
export const useSuspenseExecution = (id: string) => {
    const trpc = useTRPC()

    return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }))
}