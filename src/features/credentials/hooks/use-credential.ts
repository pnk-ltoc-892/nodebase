import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCredentialsParams } from "./use-credential-params"
import { CredentialType } from "@/generated/prisma/enums"


// Hook to fetch all credentials using suspense
export const useSuspenseCredentials = () => {
    const trpc = useTRPC()
    const [params] = useCredentialsParams()

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

// Hook to create a new credential
export const useCreateCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" Created`)
                queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({}) // Invalidating all rather than specific State
                )
            },
            onError: (error) => {
                toast.error(`Failed to create Credential: ${error.message}`)
            }
        })
    )
}

// Hook to remove a credential
export const useRemoveCredential = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    
    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" Removed`)
                queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({}) // Invalidating all rather than specific State
                )
            },
            onError: (error) => {
                toast.error(`Failed to remove Credential: ${error.message}`)
            }
        })
    )
}

// Hook to fetch single credential using suspense
export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC()

    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }))
}


// Hook to update credential
export const useUpdateCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" saved`)
                queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({})
                )
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({ id: data.id })
                )
            },
            onError: (error) => {
                toast.error(`Failed to save Credential: ${error.message}`)
            }
        })
    )
}

// Hook to fetch credential by Type
export const useCredentialByType = (type: CredentialType) => {
    const trpc = useTRPC()

    return useQuery(trpc.credentials.getByType.queryOptions({ type }))
}