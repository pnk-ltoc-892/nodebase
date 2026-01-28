"use client"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const page = () => {
    const trpc = useTRPC()
    // const testAI = useMutation(trpc.testAI.mutationOptions({
    //     onSuccess: () => {
    //         toast.success("Success")
    //     },
    //     onError: ({ message }) => {
    //         toast.error(message)
    //     }
    // }))
  return (
    <div>
      {/* <Button onClick={() => testAI.mutate()}>
        Click to test Subscription
      </Button> */}
    </div>
  )
}

export default page
