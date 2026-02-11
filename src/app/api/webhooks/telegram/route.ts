import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"

export async function POST(request: NextRequest){
    try {        
        // Decide which workflow to trigger
        const url = new URL(request.url)
        const workflowId = url.searchParams.get("workflowId") || ""

        // Get The Message
        const data = await request.json();
        const message = data.message;

        if(!workflowId && !message?.text){
            return NextResponse.json({
                success: true,
                message: "Missing required query parameter: workflowId"
            }, {status: 200})
        }        
        

        // Fire workflow execution
        queueMicrotask(async () => {
            try {
                await sendWorkflowExecution({
                    workflowId,
                    initialData: {
                        workflowId,
                        source: "telegram",
                        text: message.text,
                        chatId: message.chat.id,
                        from: message.from,
                        telegram: data
                    }
                })
                
            } catch (error) {
                console.error("Workflow execution failed:", error)                
            }
        })
        
        // Immediate ACK to Telegram
        return NextResponse.json({ success: true }, { status: 200 })
    } 
    catch (error) {
        console.error("Telegram Webhook error: ", error)
        return NextResponse.json({
            success: true,
            message: "Failed to process Telegram event"
        }, {status: 200})
    }
}