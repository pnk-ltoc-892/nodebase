import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../TriggerExecutionNode";
import { MousePointerIcon } from "lucide-react";




export const ManualTriggerNode = memo((props: NodeProps) => {
    const handleOpenSettings = () => {}     // TODO
    return (
        <>
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="When Clicking Execute Workflow"
                // status = {nodeStatus}   TODO
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})