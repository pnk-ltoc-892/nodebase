import { InitialNode } from "@/components/InitialNode";
import { HTTPRequestNode } from "@/features/executions/components/http-request/HTTPRequestNode";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/ManualTriggerNode";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";


export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HTTPRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents