import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../BaseExecutionNode"
import { DiscordDialog, DiscordFormValues } from "./Dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchDiscordRealtimeToken } from "./actions"
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord"


type DiscordNodeData = {
    webhookUrl?: string
    content?: string
    username?: string
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken
    })

    const handleOpenSettings = () => setDialogOpen(true)
    
    const { setNodes } = useReactFlow()

    const handleSubmit = (values: DiscordFormValues) => {
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
    const description = nodeData?.content ? `Send ${nodeData.content.slice(0, 50)}...` : "Not Configured"

    return (
        <>
            <DiscordDialog 
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/discord.svg"
                name="Discord"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

DiscordNode.displayName = "DiscordNode"