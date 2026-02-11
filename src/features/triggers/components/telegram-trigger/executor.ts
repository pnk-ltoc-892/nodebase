import type { NodeExecutor } from "@/features/executions/types";
import { CredentialType } from "@/generated/prisma/enums";
import { telegramTriggerChannel } from "@/inngest/channels/telegram-trigger";
import prisma from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";


type TelegramTriggerData = Record<string, unknown>


export const telegramTriggerExecutor: NodeExecutor<TelegramTriggerData> = async ({
    nodeId,
    context,
    step,
    publish
}) => {    
    // Moving all side-effects inside step.run() with stable step ID
    await step.run(`telegram-trigger:${nodeId}`, async () => {
        await publish(
            telegramTriggerChannel().status({
                nodeId,
                status: "loading"
            })
        )
    })
    let userId: string;
    let credential: string;
    try {
        // Fail Intentionally To Verify Catch Block
        // throw new Error("Error In Telegram Node")  
        // console.log(context);

        userId = await step.run("find-user-id", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: context.workflowId as string
                },
                select: {
                    userId: true
                }
            })
            return workflow.userId
        })
        credential = await step.run("find-user-bot-credential", async () => {
            const credentialValue = await prisma.credential.findFirstOrThrow({
                where: { userId, type: CredentialType.TELEGRAM}
            })
            return credentialValue.value
        })
        
        const result = await step.run(`telegram-trigger:${nodeId}`, async () => context)
          
        await step.run(`telegram-trigger:${nodeId}`, async () => {
            await publish(
                telegramTriggerChannel().status({
                    nodeId,
                    status: "success"
                })
            )
        })
        await step.run(`telegram-trigger:${nodeId}`, async () => {
            await sendTelegramMessage({
                credential,
                chatId: context.chatId as string,
                text: "Execution Started..."
            })
        })
        // Execution Success Notified At The The Node Along With Result (if any)

        return result
    }
    catch (error) {
        await step.run(`telegram-trigger:${nodeId}`, async () => {
            await publish(
                telegramTriggerChannel().status({
                    nodeId,
                    status: "error"
                })
            )
        })
        await step.run(`telegram-trigger:${nodeId}`, async () => {
            await sendTelegramMessage({
                credential,
                chatId: context.chatId as string,
                text: "Execution Failed..."
            })
        })
        throw error
    }
}