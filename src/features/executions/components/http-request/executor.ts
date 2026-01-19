import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky"

type HTTPRequestData = {
    variableName?: string
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
}

export const HTTPRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
    data,
    nodeId,
    context,
    step
}) => {
    // TODO: publish "loading" state for HTTPRequest

    if(!data.variableName){
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("Variable Name not configured")
    }
    if(!data.endpoint){
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request Node: No endpoint configured")
    }

    let RequestEndpoint: string
    try {
        const url = new URL(data.endpoint)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Only http/https endpoints are allowed")
        }
        if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
            throw new Error("Localhost endpoints are not allowed")
        }
        RequestEndpoint = url.toString()
    }
    catch {
        throw new NonRetriableError("HTTP Request Node: Invalid or disallowed endpoint")
    }

    const result = await step.run("http-request", async () => {
        const endpoint = RequestEndpoint! // ! - non null assertion
        const method = data.method || "GET"

        const options: KyOptions = { method }

        if(["POST", "PUT", "PATCH"].includes(method)){
            options.body = data.body
            options.headers = {
                "Content-Type": "application/json"
            }
        }

        const response = await ky(endpoint, options)
        
        const contentType = response.headers.get("content-type")

        const isJson = contentType?.includes("application/json") || contentType?.includes("+json")
        const responseData = isJson ? await response.json() : await response.text()

        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData
            }
        }

        if(data.variableName){  // Safely avoid typeError o/w
            return {
                ...context,
                [data.variableName]: responsePayload
            }
        }
        
        // Fallback to direct httpResponse for backward compatibility
        return {
            ...context,
            ...responsePayload
        }
    })

    // const result = await step.run(data.endpoint)

    // TODO: publish "success" state for HTTPRequest

    return result
}