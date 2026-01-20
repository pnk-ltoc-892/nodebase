import { channel, topic } from "@inngest/realtime"


export const MANUAL_CHANNEL_NAME = "manual-trigger-execution"

export const manualTriggerChannel = channel(MANUAL_CHANNEL_NAME)
                                    .addTopic(
                                        topic("status").type<{
                                            nodeId: string
                                            status: "loading" | "success" | "error"
                                        }>(),
                                    )