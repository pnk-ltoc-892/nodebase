import { InitialNode } from "@/components/InitialNode";
import { DiscordNode } from "@/features/executions/components/discord/Discord";
import { GeminiNode } from "@/features/executions/components/gemini/GeminiNode";
import { HTTPRequestNode } from "@/features/executions/components/http-request/HTTPRequestNode";
import { OpenAINode } from "@/features/executions/components/openai/OpenAINode";
import { SlackNode } from "@/features/executions/components/slack/Slack";
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
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.OPENAI]: OpenAINode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents