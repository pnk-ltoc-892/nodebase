"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"


const formSchema = z.object({
    endpoint: z.url({message: "Please enter a valid URL"}),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z
        .string()
        .optional()
        // .refine()    TODO JSON5
})

export type HTTPRequestFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<HTTPRequestFormValues>
}

export const HTTPRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: Props) => {

    const { endpoint, method, body } = defaultValues
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: endpoint ?? "",
            method: method ?? "GET",
            body: body ?? ""
        }
    })
    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if(open) {
            form.reset({
                endpoint: endpoint ?? "",
                method: method ?? "GET",
                body: body ?? ""
            })
        }
    }, [open, endpoint, method, body, form])

    const watchMethod = form.watch("method")
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod)

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        <FormField 
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a method"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The HTTP method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                className="min-h-[120px] font-mono text-sm"
                                                placeholder={
                                                    '{\n "userId": "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n "items": "{{httpResponse.data.items}}"\n}'
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON with template variables. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}