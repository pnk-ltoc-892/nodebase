import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../BaseExecutionNode"
import { GlobeIcon } from "lucide-react"
import { HTTPRequestFormValues, HTTPRequestDialog } from "./Dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchHttpRequestRealtimeToken } from "./actions"
import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from "@/inngest/channels/http-request"


type HTTPRequestNodeData = {
    variableName?: string
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
}

type HTTPRequestNodeType = Node<HTTPRequestNodeData>

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        // channel: httpRequestChannel().name,  // execute fn and then fetch name - can fail?
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken
    })

    const handleOpenSettings = () => setDialogOpen(true)
    
    const { setNodes } = useReactFlow()

    const handleSubmit = (values: HTTPRequestFormValues) => {
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
    
    const nodeData = props.data     // no explicit cast needed
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not Configured"

    return (
        <>
            <HTTPRequestDialog 
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

HTTPRequestNode.displayName = "HTTPRequestNode"