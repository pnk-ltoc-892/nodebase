import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities"
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";


Handlebars.registerHelper("json", (context) => {
    try {
        const jsonString = JSON.stringify(context, null, 2)
        const safeString = new Handlebars.SafeString(jsonString)

        return safeString
    } catch (error) {
        throw new Error(`Failed to serialize context to JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
})

type SlackData = {
    variableName?: string
    webhookUrl?: string
    content?: string
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.content){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Slack node: Message Content is missing")
    }

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)

    try {
        const result = await step.run("slack-webhook", async () => {
            if(!data.webhookUrl){
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error"
                    })
                )
                throw new NonRetriableError("Slack node: Webhook URL is required")
            }

            await ky.post(data.webhookUrl!, {
                json: {
                    content: content.slice(0, 2000), // The key depends on workflow config
                }
            })

            // Moving inside new fn scope for TypeScript
            if(!data.variableName){
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error"
                    })
                )
                throw new NonRetriableError("Slack node: Variable name is missing")
            }
            return {
                ...context,
                [data.variableName]: {
                    SlackMessageSent: true,
                    messageContent: content.slice(0, 2000),
                }
            }
        })
        
        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result
    }
    catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}