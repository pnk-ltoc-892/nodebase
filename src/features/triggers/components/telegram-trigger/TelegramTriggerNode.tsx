import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { TelegramTriggerDialog } from "./Dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchTelegramTriggerRealtimeToken } from "./actions";
import { TELEGRAM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/telegram-trigger";


export const TelegramTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: TELEGRAM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchTelegramTriggerRealtimeToken
    })
    
    const handleOpenSettings = () => setDialogOpen(true)

    return (
        <>
            <TelegramTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon="/logos/telegram.svg"
                name="Telegram"
                description="When Telegram Bot is Triggered"
                status = {nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})