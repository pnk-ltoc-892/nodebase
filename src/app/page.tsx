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

    const testAI = useMutation(trpc.testAI.mutationOptions({
      onSuccess: () => {
        toast.success("AI Job Queued")
      },
      onError: () => {
        toast.success("Something Went Wrong")
      },
    }))

    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center text-white bg-black flex-col gap-y-6">
        protected server component
        <div>
          {JSON.stringify(data)}
        </div>
        
        <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
          Generate Text
        </Button>
          <LogOutButton />
      </div>

    )
}

export default page