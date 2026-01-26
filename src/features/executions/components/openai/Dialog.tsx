"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCredentialByType } from "@/features/credentials/hooks/use-credential"
import { CredentialType } from "@/generated/prisma/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"


const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and can contain only letters, numbers and underscores"
        }),
    credentialId: z.string().min(1, "Credential is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User Prompt is required")
})

export type OpenAIFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<OpenAIFormValues>
}

export const OpenAIDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: Props) => {

    const { data: credentials, isLoading: isLoadingCredentials } = useCredentialByType(CredentialType.OPENAI)

    const { variableName, credentialId, systemPrompt, userPrompt } = defaultValues
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: variableName ?? "",
            credentialId: credentialId ?? "",
            systemPrompt: systemPrompt ?? "",
            userPrompt: userPrompt ?? ""
        }
    })
    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if(open) {
            form.reset({
                variableName: variableName ?? "",
                credentialId: credentialId ?? "",
                systemPrompt: systemPrompt ?? "",
                userPrompt: userPrompt ?? ""
            })
        }
    }, [open, variableName, credentialId, systemPrompt, userPrompt, form])

    const watchVariableName = form.watch("variableName") || "my_OpenAI_Instance"

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>OpenAI Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI Model and prompts for this node
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        <FormField 
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="my_OpenAI_Instance"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes: {" "}{`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="You are a helpful assistant"
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>OpenAI Credential</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={
                                                isLoadingCredentials 
                                                || !credentials?.length
                                            }
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Credential"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.map((credential) => (
                                                <SelectItem
                                                    key={credential.id}
                                                    value={credential.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image 
                                                            src="/logos/openai.svg"
                                                            alt="OpenAI"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        {credential.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Summarize this text: {{json httpResponse.data}}"
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}