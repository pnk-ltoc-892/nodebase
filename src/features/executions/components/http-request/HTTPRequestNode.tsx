import { Node, NodeProps } from "@xyflow/react"
import { memo } from "react"
import { BaseExecutionNode } from "../BaseExecutionNode"
import { GlobeIcon } from "lucide-react"



type HTTPRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
    [key: string]: unknown
}

type HTTPRequestNodeType = Node<HTTPRequestNodeData>

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
    
    const nodeData = props.data as HTTPRequestNodeData
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not Configured"

    return (
        <>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onSettings={() => {}}
                onDoubleClick={() => {}}
            />
        </>
    )
})

HTTPRequestNode.displayName = "HTTPRequestNode"