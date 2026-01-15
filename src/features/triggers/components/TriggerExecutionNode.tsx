"use client"

import { Position, type NodeProps } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNode } from "@/components/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description?: string
    children?: React.ReactNode
    // status?: NodeStatus
    onSettings?: () => void
    onDoubleClick?: () => void
}

export const BaseTriggerNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick
    }: BaseTriggerNodeProps) => {
        // TODO: add delete method
        const handleDelete = () => {}

        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onSettings={onSettings}
            >
                {/* // TODO: Wrap within NodeStatusIndicator */}
                <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16}/>
                    ) : (
                        <Icon className="size-4 text-muted-foreground"/>
                    )}
                    {children}
                    <BaseHandle 
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />
                </BaseNodeContent>
                </BaseNode>
            </WorkflowNode>
        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"