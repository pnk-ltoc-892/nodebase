import { InitialNode } from "@/components/InitialNode";
import { HTTPRequestNode } from "@/features/executions/components/http-request/HTTPRequestNode";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/GoogleFormTriggerNode";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/ManualTriggerNode";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/StripeTriggerNode";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";


export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HTTPRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents