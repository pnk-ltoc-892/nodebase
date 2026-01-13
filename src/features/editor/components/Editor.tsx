"use client"

import { ErrorView, LoadingView } from "@/components/EntityComponents"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"


export const Editor = ({ workflowId }: { workflowId: string }) => {
    const {data: workflow} = useSuspenseWorkflow(workflowId)
  return (
    <div>
        {JSON.stringify(workflow, null, 2)}
    </div>
  )
}

export const EditorLoading = () => {
    return <LoadingView message="Loading Editor..."/>
}

export const EditorError = () => {
    return <ErrorView message="Error Loading Editor..."/>
}
