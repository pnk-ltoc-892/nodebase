import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities"
import ky from "ky";


Handlebars.registerHelper("json", (context) => {
    try {
        const jsonString = JSON.stringify(context, null, 2)
        const safeString = new Handlebars.SafeString(jsonString)

        return safeString
    } catch (error) {
        throw new Error(`Failed to serialize context to JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
})

type DiscordData = {
    variableName?: string
    webhookUrl?: string
    content?: string
    username?: string
}

export const discordExecutor: NodeExecutor<DiscordData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    await publish(
        discordChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.content){
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Discord node: Message Content is missing")
    }

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)
    const username = data.username
        ? decode(Handlebars.compile(data.username)(context))
        : undefined

    try {
        const result = await step.run("discord-webhook", async () => {
            if(!data.webhookUrl){
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error"
                    })
                )
                throw new NonRetriableError("Discord node: Webhook URL is required")
            }

            await ky.post(data.webhookUrl!, {
                json: {
                    content: content.slice(0, 2000),
                    username
                }
            })

            // Moving inside new fn scope for TypeScript
            if(!data.variableName){
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error"
                    })
                )
                throw new NonRetriableError("Discord node: Variable name is missing")
            }
            return {
                ...context,
                [data.variableName]: {
                    discordMessageSent: true,
                    messageContent: content.slice(0, 2000),
                }
            }
        })
        
        await publish(
            discordChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result
    }
    catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}