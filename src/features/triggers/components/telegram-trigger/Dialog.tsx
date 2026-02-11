"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const TelegramTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams()
    const workflowId = params.workflowId as string

    // Construct the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/telegram?workflowId=${workflowId}`

    const isLocalDev = baseUrl.includes("localhost")

    const copyText = async (text: string, successMsg: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(successMsg)
        } catch {
            toast.error("Failed to copy to clipboard")
        }
    }

    const ngrokCommand = `ngrok http 3000`

    const setWebhookScript = `curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "${webhookUrl}"
  }'`

    const getWebhookInfoScript = `curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"`

    // Optional: manual test payload (helps debugging)
    const testWebhookScript = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"message":{"text":"hello from curl","chat":{"id":1},"from":{"id":1}}}'`

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[85vh] overflow-hidden p-0">
                <DialogHeader className="p-6 pb-3">
                    <DialogTitle>Telegram Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Register this webhook URL in your Telegram bot to execute this workflow when the bot receives a message.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-88px)]">
                    <div className="space-y-4">
                        {/* Webhook URL */}
                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">Webhook URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="webhook-url"
                                    value={webhookUrl}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => copyText(webhookUrl, "Webhook URL copied to clipboard")}
                                    aria-label="Copy webhook URL"
                                    title="Copy webhook URL"
                                >
                                    <CopyIcon className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Setup Instructions */}
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Setup Instructions</h4>

                            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                                <li>
                                    <span className="font-medium text-foreground">Create a Telegram bot</span>
                                    <ul className="mt-1 ml-5 list-disc space-y-1">
                                        <li>Open Telegram and search for <span className="font-mono">BotFather</span>.</li>
                                        <li>Send <span className="font-mono">/newbot</span> and follow the prompts.</li>
                                        <li>Copy your <span className="font-medium text-foreground">Bot Token</span> (keep it private).</li>
                                    </ul>
                                </li>

                                {
                                    isLocalDev && <>
                                        <li>
                                            <span className="font-medium text-foreground">Start your app locally</span>
                                            <ul className="mt-1 ml-5 list-disc space-y-1">
                                                <li>Run your Next.js app on <span className="font-mono">http://localhost:3000</span>.</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <span className="font-medium text-foreground">Expose your local server using ngrok</span>
                                            <ul className="mt-1 ml-5 list-disc space-y-1">
                                                <li>Run ngrok and copy the HTTPS URL.</li>
                                            </ul>

                                            <div className="mt-2 flex items-center gap-2">
                                                <Input readOnly value={ngrokCommand} className="font-mono text-sm" />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyText(ngrokCommand, "ngrok command copied")}
                                                    aria-label="Copy ngrok command"
                                                    title="Copy ngrok command"
                                                >
                                                    <CopyIcon className="size-4" />
                                                </Button>
                                            </div>
                                        </li>

                                    </>
                                }

                                <li>
                                    <span className="font-medium text-foreground">Set the Telegram webhook</span>
                                    <ul className="mt-1 ml-5 list-disc space-y-1">
                                        <li>Run this command in a terminal (replace <span className="font-mono">&lt;YOUR_BOT_TOKEN&gt;</span>).</li>
                                    </ul>

                                    <div className="mt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => copyText(setWebhookScript, "setWebhook script copied")}
                                            className="w-full justify-start"
                                        >
                                            <CopyIcon className="size-4 mr-2" />
                                            Copy setWebhook Script
                                        </Button>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            This sets the webhook URL for your bot so every message triggers this workflow.
                                        </p>
                                    </div>
                                </li>

                                <li>
                                    <span className="font-medium text-foreground">Verify the webhook</span>
                                    <ul className="mt-1 ml-5 list-disc space-y-1">
                                        <li>Run this to confirm Telegram saved your webhook URL:</li>
                                    </ul>

                                    <div className="mt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => copyText(getWebhookInfoScript, "getWebhookInfo command copied")}
                                            className="w-full justify-start"
                                        >
                                            <CopyIcon className="size-4 mr-2" />
                                            Copy getWebhookInfo Command
                                        </Button>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Look for <span className="font-mono">url</span> in the response and make sure it matches the webhook URL.
                                        </p>
                                    </div>
                                </li>

                                <li>
                                    <span className="font-medium text-foreground">Test the trigger</span>
                                    <ul className="mt-1 ml-5 list-disc space-y-1">
                                        <li>Send a message to your bot in Telegram.</li>
                                        <li>Your workflow should execute automatically.</li>
                                    </ul>
                                </li>

                                <li>
                                    <span className="font-medium text-foreground">Optional: Manual webhook test (debugging)</span>
                                    <ul className="mt-1 ml-5 list-disc space-y-1">
                                        <li>Use this to simulate a Telegram message hitting your webhook:</li>
                                    </ul>

                                    <div className="mt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => copyText(testWebhookScript, "Manual test curl copied")}
                                            className="w-full justify-start"
                                        >
                                            <CopyIcon className="size-4 mr-2" />
                                            Copy Manual Test Curl
                                        </Button>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Helpful if Telegram isn’t calling your endpoint yet. This should return <span className="font-mono">{"{ success: true }"}</span>.
                                        </p>
                                    </div>
                                </li>

                                {
                                    isLocalDev && <>
                                        <li>
                                            <span className="font-medium text-foreground">Important note (ngrok URL changes)</span>
                                            <ul className="mt-1 ml-5 list-disc space-y-1">
                                                <li>If you restart ngrok, you get a new public URL.</li>
                                                <li>You must run <span className="font-mono">setWebhook</span> again with the new URL.</li>
                                            </ul>
                                        </li>
                                    </>
                                }
                            </ol>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}