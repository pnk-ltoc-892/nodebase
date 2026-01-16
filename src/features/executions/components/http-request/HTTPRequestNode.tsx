import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../BaseExecutionNode"
import { GlobeIcon } from "lucide-react"
import { FormType, HTTPRequestDialog } from "./Dialog"



type HTTPRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
    [key: string]: unknown
}

type HTTPRequestNodeType = Node<HTTPRequestNodeData>

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)
    const nodeStatus = "initial"

    const handleOpenSettings = () => setDialogOpen(true)
    
    const { setNodes } = useReactFlow()

    const handleSubmit = (values: FormType) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        endpoint: values.endpoint,
                        method: values.method,
                        body: values.body
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
                defaultEndpoint={nodeData.endpoint} // TODO: check for improvement by sending just initialValues = {nodeData}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}
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