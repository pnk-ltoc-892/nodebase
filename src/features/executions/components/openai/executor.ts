import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";


Handlebars.registerHelper("json", (context) => {
    try {
        const jsonString = JSON.stringify(context, null, 2)
        const safeString = new Handlebars.SafeString(jsonString)

        return safeString
    } catch (error) {
        throw new Error(`Failed to serialize context to JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
})

type OpenAIData = {
    variableName?: string
    credentialId?: string
    model?: string
    systemPrompt?: string
    userPrompt?: string
}

export const openAIExecutor: NodeExecutor<OpenAIData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    await publish(
        openaiChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.variableName){
         await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("OpenAI node: Variable name is missing")
    }
    if(!data.credentialId){
             await publish(
                openaiChannel().status({
                    nodeId,
                    status: "error"
                })
            )
            throw new NonRetriableError("OpenAI node: Credential is required")
        }
    if(!data.userPrompt){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("OpenAI node: User prompt is missing")
    }

    // TODO: Throw if ceredential is missing

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant"

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId
                // TODO: Add UserId it is needed to prevent ID Injection
            }
        })
    })
    if(!credential){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("OpenAI node: Credential not found")
    }

    const openai = createOpenAI({
        apiKey: credential.value
    })

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-4o-mini"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {   // for sentry
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true
                }
            }
        )

        const firstStep = steps?.[0]
        const firstContent = firstStep?.content?.[0]
        const text = 
            firstContent?.type === "text" 
                ? firstContent.text
                : ""
        
        await publish(
            openaiChannel().status({
                nodeId,
                status: "success"
            })
        )

        return {
            ...context,
            [data.variableName]: {
                text
            }
        }
    }
    catch (error) {
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}