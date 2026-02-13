import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";


// Create a client to send and receive events
export const inngest = new Inngest({
    id: "nodebase",
    eventKey: process.env.INNGEST_EVENT_KEY,
    middleware: [realtimeMiddleware()]
});