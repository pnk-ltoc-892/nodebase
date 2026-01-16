import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./Dialog";


export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const nodeStatus = "initial"
    
    const handleOpenSettings = () => setDialogOpen(true)

    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="When Clicking Execute Workflow"
                status = {nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})