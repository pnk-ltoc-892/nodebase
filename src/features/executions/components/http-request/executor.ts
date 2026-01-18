import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky"

type HTTPRequestData = {
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

    if(!data.endpoint){
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request Node: No endpoint configured")
    }

    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint! // ! - non null assertion
        const method = data.method || "GET"

        const options: KyOptions = { method }

        if(["POST", "PUT", "PATCH"].includes(method)){
            options.body = data.body
        }

        const response = await ky(endpoint, options)
        const contentType = response.headers.get("content-type")
        const responseData = contentType?.includes("applications/json") 
                                                    ? await response.json()
                                                    : await response.text()

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData
            }
        }

        
    })

    // const result = await step.run(data.endpoint)

    // TODO: publish "success" state for HTTPRequest

    return result
}