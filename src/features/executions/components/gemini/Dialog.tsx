"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCredentialByType } from "@/features/credentials/hooks/use-credential"
import { CredentialType } from "@/generated/prisma/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

// export const AVAILABLE_MODELS = [
//     "gemini-1.5-flash",
//     "gemini-2.0-flash",
//     "gemini-2.5-flash",
// ] as const

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and can contain only letters, numbers and underscores"
        }),
    credentialId: z.string().min(1, "Credential is required"),
    // model: z.string().min(1, "Model is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User Prompt is required")
})

export type GeminiFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<GeminiFormValues>
}

export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: Props) => {

    const { data: credentials, isLoading: isLoadingCredentials } = useCredentialByType(CredentialType.GEMINI)

    const { variableName, credentialId, systemPrompt, userPrompt } = defaultValues
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: variableName ?? "",
            credentialId: credentialId ?? "",
            // model: model ?? AVAILABLE_MODELS[0],
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
                // model: model ?? AVAILABLE_MODELS[0],
                systemPrompt: systemPrompt ?? "",
                userPrompt: userPrompt ?? ""
            })
        }
    }, [open, variableName, credentialId, systemPrompt, userPrompt, form])

    const watchVariableName = form.watch("variableName") || "my_Gemini_Instance"

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
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
                                            placeholder="my_Gemini_Instance"
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
                            name="credentialId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Gemini Credential</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
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
                                                            src="/logos/gemini.svg"
                                                            alt="Gemini"
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
                        {/* <FormField 
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a model"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {AVAILABLE_MODELS.map((model) => (
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The Google Gemini model to use for completion
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
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