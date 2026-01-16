"use client"

import { NodeSelector } from "@/components/NodeSelector"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false)
    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button
                // Not needed as Sheet Trigger is rendering asChild and will Take Care
                // onClick={() => setSelectorOpen(true)}
                // onClick={() => {}}
                size="icon"
                variant="outline"
                className="bg-background"
            >
                <PlusIcon />
            </Button>
        </NodeSelector>
        
    )
})
