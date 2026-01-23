import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { openaiChannel } from "@/inngest/channels/openai";


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

    // TODO: Fetch credential that user selected
    const ceredentialValue = process.env.OPENAI_API_KEY
    const openai = createOpenAI({
        apiKey: ceredentialValue
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

        const text = 
            steps[0].content[0].type === "text" 
                ? steps[0].content[0].text
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