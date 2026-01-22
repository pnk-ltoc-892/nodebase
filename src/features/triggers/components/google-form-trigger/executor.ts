import type { NodeExecutor } from "@/features/executions/types";
import { googleformTriggerChannel } from "@/inngest/channels/google-form-trigger";


type GoogleFormTriggerData = Record<string, unknown>

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        googleformTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    try {
        const result = await step.run(`google-form-trigger:${nodeId}`, async () => context)
    
        await publish(
            googleformTriggerChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result
    }
    catch (error) {
        await publish(
            googleformTriggerChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}