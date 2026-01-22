"use server"

import { getSubscriptionToken, type Realtime } from "@inngest/realtime"
import { inngest } from "@/inngest/client"
import { googleformTriggerChannel } from "@/inngest/channels/google-form-trigger"


export type GoogleFormTriggerToken = Realtime.Token<
    typeof googleformTriggerChannel,
    ["status"]
>

export async function fetchGoogleformTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleformTriggerChannel(),
        topics: ["status"]
    })

    return token
}