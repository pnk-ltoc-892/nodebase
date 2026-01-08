"use client"
import { Button } from "@/components/ui/button"
import LogOutButton from "./logout"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const page = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const { data } = useQuery(trpc.getWorkflows.queryOptions())

    const create = useMutation(trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        // queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
        toast.success("Job queued")
      }
    }))

    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center text-white bg-black flex-col gap-y-6">
        protected server component
        <div>
          {JSON.stringify(data)}
        </div>
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          Create Workflow
        </Button>
          <LogOutButton />
      </div>

    )
}

export default page