"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Keyboard, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface KeyboardShortcut {
    keys: string[]
    description: string
    mode?: "single" | "both"
}

const shortcuts: KeyboardShortcut[] = [
    {
        keys: ["←", "Page Up"],
        description: "Previous page",
        mode: "single",
    },
    {
        keys: ["→", "Page Down", "Space"],
        description: "Next page",
        mode: "single",
    },
    {
        keys: ["Home"],
        description: "Go to first page",
        mode: "single",
    },
    {
        keys: ["End"],
        description: "Go to last page",
        mode: "single",
    },
    {
        keys: ["F11"],
        description: "Toggle fullscreen",
        mode: "both",
    },
]

export function KeyboardShortcutsDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Keyboard shortcuts">
                    <Keyboard className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <DialogDescription>
                        Use these shortcuts to navigate the PDF reader more efficiently
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                    {shortcut.description}
                                </p>
                                {shortcut.mode === "single" && (
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        Single page mode only
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <span key={keyIndex} className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
                                            {key}
                                        </kbd>
                                        {keyIndex < shortcut.keys.length - 1 && (
                                            <span className="text-xs text-muted-foreground">or</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
