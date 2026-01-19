import type { NodeExecutor } from "@/features/executions/types";


type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId,
    context,
    step
}) => {
    // TODO: publish "loading" state for manual Trigger

    const result = await step.run(`manual-trigger:${nodeId}`, async () => context)

    // TODO: publish "success" state for manual Trigger

    return result
}