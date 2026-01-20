import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky"
import { httpRequestChannel } from "@/inngest/channels/http-request";


Handlebars.registerHelper("json", (context) => {
    try {
        const jsonString = JSON.stringify(context, null, 2)
        const safeString = new Handlebars.SafeString(jsonString)

        return safeString
    } catch (error) {
        throw new Error(`Failed to serialize context to JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
})

type HTTPRequestData = {
    variableName: string
    endpoint: string
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
}

export const HTTPRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {

    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.variableName){
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Variable Name not configured")
    }
    if(!data.endpoint){
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("HTTP Request Node: No endpoint configured")
    }
    if(!data.method){
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("HTTP Request Node: Method not configured")
    }

    let RequestEndpoint: string
    RequestEndpoint = data.endpoint
    // try {
    //     const url = new URL(data.endpoint)
    //     if (!["http:", "https:"].includes(url.protocol)) {
    //         throw new Error("Only http/https endpoints are allowed")
    //     }
    //     if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    //         throw new Error("Localhost endpoints are not allowed")
    //     }
    //     RequestEndpoint = url.toString()
    // }
    // catch {
    //     throw new NonRetriableError("HTTP Request Node: Invalid or disallowed endpoint")
    // }

    try {
        const result = await step.run("http-request", async () => {
            // http://..../{{todo.httpResponse.data.userId}}
            // context - refers to previous node Data
            
            try {
                const template = Handlebars.compile(RequestEndpoint)
                RequestEndpoint = template(context)
    
                if(!RequestEndpoint || typeof RequestEndpoint !== 'string'){
                    throw new Error('Endpoint template must resolve to non-empty string')
                }
            }
            catch (error) {
                throw new NonRetriableError(`HTTP Request Node: Failed to resolve endpoint template: ${error instanceof Error ? error.message : String(error)}`)
            }
    
            const method = data.method
    
            const options: KyOptions = { method }
    
            if(["POST", "PUT", "PATCH"].includes(method)){
                try {
                    const resolved = Handlebars.compile(data.body || "{}")(context)
                    JSON.parse(resolved) // Validate JSON structure
                    options.body = resolved
                } 
                catch (error) {
                    throw new NonRetriableError(
                        `HTTP Request Node: Failed to resolve body template: ${error instanceof Error ? error.message : String(error)}`
                    )
                }
                options.headers = {
                    "Content-Type": "application/json"
                }
            }
    
            const response = await ky(RequestEndpoint, options)
            
            const contentType = response.headers.get("Content-type")
    
            const isJson = contentType?.includes("application/json") || contentType?.includes("+json")
            const responseData = isJson ? await response.json() : await response.text()
    
            const responsePayload = {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData
                }
            }
    
            return {
                ...context,
                [data.variableName]: responsePayload
            }
        })
    
        // const result = await step.run(data.endpoint)
    
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result
    } 
    catch (error) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}