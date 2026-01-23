import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../BaseExecutionNode"
import { GeminiDialog, GeminiFormValues } from "./Dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini"
import { fetchGeminiRealtimeToken } from "./actions"


type GeminiNodeData = {
    variableName?: string
    // model?: string
    systemPrompt?: string
    userPrompt?: string
}

type GeminiNodeType = Node<GeminiNodeData>

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken
    })

    const handleOpenSettings = () => setDialogOpen(true)
    
    const { setNodes } = useReactFlow()

    const handleSubmit = (values: GeminiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values
                    }
                }
            }
            return node
        }))
    }
    
    const nodeData = props.data
    const description = nodeData?.userPrompt ? `${"gemini-2.5-flash"}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not Configured"

    return (
        <>
            <GeminiDialog 
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/gemini.svg"
                name="Gemini"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

GeminiNode.displayName = "GeminiNode"