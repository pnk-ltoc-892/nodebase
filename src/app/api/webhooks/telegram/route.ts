import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    try {        
        // Decide which workflow to trigger
        const url = new URL(request.url)
        const workflowId = url.searchParams.get("workflowId")

        if(!workflowId){
            return NextResponse.json({
                success: false,
                error: "Missing required query parameter: workflowId"
            }, {status: 400})
        }

        // Get The Message
        const data = await request.json();

        // console.log("Bot Webhook Triggered\n");
        // console.log(data);
        
        const message = data.message;
        if(!message?.text){
            return NextResponse.json({ success: true}, {status: 200})
        }

        // Fire workflow execution
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

        return NextResponse.json({ success: true }, { status: 200 })
    } 
    catch (error) {
        console.error("Telegram Webhook error: ", error)
        return NextResponse.json({
            success: false,
            error: "Failed to process Telegram event"
        }, {status: 500})
    }
}