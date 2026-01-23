import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleformTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";


export const executeWorkflow = inngest.createFunction(
    { 
        id: "execute-workflow",
        retries: 0  // TODO: Remove In production
    },
    { 
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleformTriggerChannel(),
            stripeTriggerChannel(),
            geminiChannel()
        ]
    },
    async ({ event, step, publish }) => {

        const workflowId = event.data.workflowId
        if(!workflowId){
            throw new NonRetriableError("Workflow ID is missing")
        }

        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowId
                },
                include: {
                    nodes: true,
                    connections: true
                }
            })
            // we can retry as DB connection error might exist - No Error if we find !workflow

            return topologicalSort(workflow.nodes, workflow.connections)
        })

        // Initialize the context with any initial data from the trigger
        let context = event.data.initialData || {}

        // Execute each node
        for(const node of sortedNodes){
            const executor = getExecutor(node.type as NodeType)
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                context,
                step,
                publish
            })
        }

        return {
            workflowId,
            result: context
        }
    },
);
